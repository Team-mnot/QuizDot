package com.mnot.quizdot.domain.member.service;

import com.mnot.quizdot.domain.member.dto.CustomMemberDetail;
import com.mnot.quizdot.domain.member.dto.JoinDto;
import com.mnot.quizdot.domain.member.dto.MemberInfoDto;
import com.mnot.quizdot.domain.member.entity.Character;
import com.mnot.quizdot.domain.member.entity.Member;
import com.mnot.quizdot.domain.member.entity.MemberCharacter;
import com.mnot.quizdot.domain.member.entity.MemberTitle;
import com.mnot.quizdot.domain.member.entity.ModeType;
import com.mnot.quizdot.domain.member.entity.MultiRecord;
import com.mnot.quizdot.domain.member.entity.Role;
import com.mnot.quizdot.domain.member.entity.Title;
import com.mnot.quizdot.domain.member.repository.CharacterRepository;
import com.mnot.quizdot.domain.member.repository.MemberCharacterRepository;
import com.mnot.quizdot.domain.member.repository.MemberRepository;
import com.mnot.quizdot.domain.member.repository.MemberTitleRepository;
import com.mnot.quizdot.domain.member.repository.MultiRecordRepository;
import com.mnot.quizdot.domain.member.repository.TitleRepository;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final MultiRecordRepository multiRecordRepository;
    private final TitleRepository titleRepository;
    private final MemberTitleRepository memberTitleRepository;
    private final CharacterRepository characterRepository;
    private final MemberCharacterRepository memberCharacterRepository;
    //비밀번호 암호화
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public void joinMember(JoinDto joinDTO) {

        log.info("회원 가입 서비스 : START");

        //폼에서 받아온 정보들
        String memberId = joinDTO.getMemberId();
        String password = joinDTO.getPassword();
        String nickname = joinDTO.getNickname();
        String hint = joinDTO.getHint();
        //아이디 중복 확인
        Boolean isExistId = memberRepository.existsByMemberId(memberId);
        if (isExistId) {
            throw new BusinessException(ErrorCode.DUPLICATED_MEMBER_ID);
        }
        //닉네임 중복 확인
        Boolean isExistNickname = memberRepository.existsByNickname(nickname);
        if (isExistNickname) {
            throw new BusinessException(ErrorCode.DUPLICATED_MEMBER_NICKNAME);
        }
        //멤버 엔티티 생성 및 저장
        Member member = Member.builder()
            .memberId(memberId)
            .password(bCryptPasswordEncoder.encode(password))
            .nickname(nickname)
            .hint(bCryptPasswordEncoder.encode(hint))
            .role(Role.ROLE_USER)
            .build();
        memberRepository.save(member);

        //멀티 전적 생성 및 저장
        MultiRecord normalRecord = MultiRecord.builder()
            .member(member)
            .mode(ModeType.NORMAL)
            .build();
        multiRecordRepository.save(normalRecord);
        MultiRecord survivalRecord = MultiRecord.builder()
            .member(member)
            .mode(ModeType.SURVIVAL)
            .build();
        multiRecordRepository.save(survivalRecord);

        //TODO: 칭호는 해금방식이기 때문에 처음에 생성될 때 중계테이블에 모든 칭호를 담아주고 1번 칭호만 true를 설정해주고 나머지 칭호는 모두 false인 상태로 값을 추가해놓아야함.
        Title defaultTitle = titleRepository.findById(1)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_TITLE));
        MemberTitle memberTitle = MemberTitle.builder()
            .title(defaultTitle)
            .member(member)
            .isGet(true)
            .build();
        memberTitleRepository.save(memberTitle);

        Character defaultCharacter = characterRepository.findById(1)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_CHRACTERS));
        MemberCharacter memberCharacter = MemberCharacter.builder()
            .character(defaultCharacter)
            .member(member)
            .build();
        memberCharacterRepository.save(memberCharacter);
        log.info("회원 가입 서비스 : COMPLETE");
    }


    @Override
    public void deleteMember(@AuthenticationPrincipal CustomMemberDetail customMemberDetail) {
        log.info("회원 탈퇴 : START");
        //Id로 조회해서 없으면 에러 발생
        if (!memberRepository.existsByMemberId(customMemberDetail.getUsername())) {
            throw new BusinessException(ErrorCode.NOT_FOUND_MEMBER);
        }
        //존재하면 삭제하고 종료
        memberRepository.deleteByMemberId(customMemberDetail.getUsername());

        log.info("회원 탈퇴 : COMPLETE");
        return;
    }

    @Override
    public void chkHint(String memberId, String hint) {
        Member member = memberRepository.findByMemberId(memberId)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_MEMBER));
        //힌트가 맞는지 확인하기
        if (!bCryptPasswordEncoder.matches(hint, member.getHint())) {
            //힌트가 다르면 에러 발생
            throw new BusinessException(ErrorCode.INVALID_MEMBER_PASSWORD);
        }
        member.updateHint(bCryptPasswordEncoder.encode(hint));
    }

    @Override
    public void findPassword(String memberId, String password, String passwordChk) {
        Member member = memberRepository.findByMemberId(memberId)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_MEMBER));
//        if (member == null) {
//            throw new BusinessException(ErrorCode.MEMBER_NOT_EXISTS);
//        }
        if (!password.equals(passwordChk)) {
            //비밀번호와 비밀번호 확인이 일치할때만 업데이트
            throw new BusinessException(ErrorCode.INVALID_MEMBER_PASSWORD);
        } else {
            member.updatePassword(bCryptPasswordEncoder.encode(password));
        }
    }

    @Override
    public void checkPassword(CustomMemberDetail customMemberDetail, String password) {
        //입력받은 암호와 로그인한 유저의 암호화된 비밀번호가 일치하는지 확인
        log.info("비밀번호 체크 하는 곳 member  ");
        Member member = memberRepository.findByMemberId(customMemberDetail.getUsername())
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_MEMBER));
        log.info("서비스단 password : {}", password);
        log.info("커스텀 멤버 디테일 password : {}", member.getPassword());
        if (!bCryptPasswordEncoder.matches(password, member.getPassword())) {
            //일치한다면 ok 보내고 일치하지 않으면 에러 발생
            throw new BusinessException(ErrorCode.INVALID_MEMBER_PASSWORD);
        } else {
            return;
        }
    }

    @Override
    public void modifyPassword(CustomMemberDetail customMemberDetail, String password,
        String chkPassword) {
        //멤버가 있는지 확인
        Member member = memberRepository.findByMemberId(customMemberDetail.getUsername())
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_MEMBER));
//        if (temp == null) {
//            //없으면 에러 발생
//            throw new BusinessException(ErrorCode.MEMBER_NOT_EXISTS);
//        }
        //새 비밀번호와 새 비밀번호 확인용이 같은지 체크 다르면 에러발생
        if (!password.equals(chkPassword)) {
            throw new BusinessException(ErrorCode.INVALID_MEMBER_PASSWORD);
        }
        //비밀번호 업데이트
        member.updatePassword(bCryptPasswordEncoder.encode(password));
    }

    @Override
    public MemberInfoDto getInfo(int memberId) {
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_MEMBER));
        MultiRecord normalRecord = multiRecordRepository.findByMemberIdAndMode(memberId,
                ModeType.NORMAL)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_RECORD));
        MultiRecord survivalRecord = multiRecordRepository.findByMemberIdAndMode(memberId,
                ModeType.SURVIVAL)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_RECORD));

        String title = titleRepository.findById(member.getTitleId())
            .orElseThrow(() -> new BusinessException(ErrorCode.LOCK_TITLE_ERROR)).getTitle();

        float normalRate = normalRecord.getTotalCount() == 0 ? 0.0f
            : (float) normalRecord.getWinCount() / normalRecord.getTotalCount() * 100;
        float survivalRate = survivalRecord.getTotalCount() == 0 ? 0.0f
            : (float) survivalRecord.getWinCount() / survivalRecord.getTotalCount() * 100;
        float totalRate =
            (survivalRecord.getTotalCount() + normalRecord.getTotalCount()) == 0 ? 0.0f
                : (float) (survivalRecord.getWinCount() + normalRecord.getWinCount())
                    / (survivalRecord.getTotalCount() + normalRecord.getTotalCount()) * 100;

        return MemberInfoDto.builder()
            .id(memberId)
            .totalRate(totalRate)
            .normalRate(normalRate)
            .survivalRate(survivalRate)
            .nickname(member.getNickname())
            .nicknameColor(member.getNicknameColor())
            .totalWinCount(normalRecord.getWinCount() + survivalRecord.getWinCount())
            .normalWinCount(normalRecord.getWinCount())
            .survivalWinCount(survivalRecord.getWinCount())
            .title(title)
            .titleListDtos(titleRepository.findAllTitlesByMemberId(memberId))
            .characterId(member.getCharacterId())
            .characterListDtos(characterRepository.findAllCharacterByMemberId(memberId))
            .point(member.getPoint())
            .level(member.getLevel())
            .exp(member.getExp())
            .build();
    }

    @Override
    public void modifyNickname(CustomMemberDetail customMemberDetail, String nickname) {
        Member member = memberRepository.findByMemberId(customMemberDetail.getUsername())
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_MEMBER));
        //닉네임 중복 확인
        Boolean isExistNickname = memberRepository.existsByNickname(nickname);
        if (isExistNickname) {
            throw new BusinessException(ErrorCode.DUPLICATED_MEMBER_NICKNAME);
        }
        member.updateNickname(nickname);
    }

    @Override
    public void modifyCharacter(CustomMemberDetail customMemberDetail, int characterId) {
        Member member = memberRepository.findByMemberId(customMemberDetail.getUsername())
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_MEMBER));
        member.updateCharacterId(characterId);
    }

    @Override
    public void modifyTitle(CustomMemberDetail customMemberDetail, int titleId) {
        Member member = memberRepository.findByMemberId(customMemberDetail.getUsername())
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_MEMBER));
        if (!memberTitleRepository.existsByTitleIdAndMemberIdAndIsGetTrue(
            customMemberDetail.getId(),
            titleId)) {
            throw new BusinessException(ErrorCode.LOCK_TITLE_ERROR);
        }
        member.updateTitleId(titleId);
    }

    @Override
    public int gachaCharacter(CustomMemberDetail customMemberDetail) {
        Member member = memberRepository.findById(customMemberDetail.getId())
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_MEMBER));
        if (member.getPoint() < 50) {
            throw new BusinessException(ErrorCode.REJECT_ACCOUNT_POINT);
        }

        //2부터 10까지
        int pickCharacter = (int) (Math.random() * 9) + 2;
        member.updatePoint(member.getPoint() - 50);
        List<Integer> characterList = memberCharacterRepository.findCharacterIdsByMemberId(
            member.getId());

        //내가 없는 캐릭터라면
        if (!characterList.contains(pickCharacter)) {
            Character character = characterRepository.findById(pickCharacter)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_CHRACTERS));
            MemberCharacter memberCharacter = MemberCharacter.builder()
                .character(character)
                .member(member)
                .build();
            memberCharacterRepository.save(memberCharacter);
        }
        return pickCharacter;
    }

    @Override
    public String gachaColor(CustomMemberDetail customMemberDetail) {
        Member member = memberRepository.findById(customMemberDetail.getId())
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_MEMBER));

        if (member.getPoint() < 50) {
            throw new BusinessException(ErrorCode.REJECT_ACCOUNT_POINT);
        }

        member.updatePoint(member.getPoint() - 50);
        int r = (int) (Math.random() * 256);
        int g = (int) (Math.random() * 256);
        int b = (int) (Math.random() * 256);
        String pickColor = String.format("#%02x%02x%02x", r, g, b);

        member.updateNicknameColor(pickColor);

        return pickColor;
    }
}
