package com.mnot.quizdot.domain.member.service;

import com.mnot.quizdot.domain.member.dto.CustomMemberDetail;
import com.mnot.quizdot.domain.member.dto.JoinDto;
import com.mnot.quizdot.domain.member.entity.Member;
import com.mnot.quizdot.domain.member.entity.ModeType;
import com.mnot.quizdot.domain.member.entity.MultiRecord;
import com.mnot.quizdot.domain.member.entity.Role;
import com.mnot.quizdot.domain.member.repository.MemberRepository;
import com.mnot.quizdot.domain.member.repository.MultiRecordRepository;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
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
            throw new BusinessException(ErrorCode.EXISTS_ID_ERROR);
        }
        //닉네임 중복 확인
        Boolean isExistNickname = memberRepository.existsByNickname(nickname);
        if (isExistNickname) {
            throw new BusinessException(ErrorCode.EXISTS_NICKNAME_ERROR);
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

        // TODO : 아바타랑 칭호 생기면 추가할것

        log.info("회원 가입 서비스 : COMPLETE");
    }

    //GUEST의 아이디와 닉네임은 어떤식으로 랜덤할것인지?
    @Override
    public void joinGuest() {

    }

    @Override
    public void deleteMember(@AuthenticationPrincipal CustomMemberDetail member) {
        log.info("회원 탈퇴 : START");
        //Id로 조회해서 없으면 에러 발생
        if (!memberRepository.existsByMemberId(member.getUsername())) {
            throw new BusinessException(ErrorCode.ENTITY_NOT_FOUND);
        }
        //존재하면 삭제하고 종료
        memberRepository.deleteByMemberId(member.getUsername());

        log.info("회원 탈퇴 : COMPLETE");
        return;
    }

    @Override
    public void chkHint(String memberId, String hint) {
        Member member = memberRepository.findByMemberId(memberId);
        //힌트가 맞는지 확인하기
        if (!bCryptPasswordEncoder.matches(hint, member.getHint())) {
            //힌트가 다르면 에러 발생
            throw new BusinessException(ErrorCode.HINT_DO_NOT_MATCH);
        }
        member.updateHint(bCryptPasswordEncoder.encode(hint));
    }

    @Override
    public void findPassword(String memberId, String password, String passwordChk) {
        Member member = memberRepository.findByMemberId(memberId);
        if (member == null) {
            throw new BusinessException(ErrorCode.ENTITY_NOT_FOUND);
        }
        if (password.equals(passwordChk)) {
            //비밀번호와 비밀번호 확인이 일치할때만 업데이트
            member.updatePassword(bCryptPasswordEncoder.encode(password));
        } else {
            throw new BusinessException(ErrorCode.PASSWORD_DO_NOT_MATCH);
        }
    }

    @Override
    public void checkPassword(CustomMemberDetail member, String password) {
        //입력받은 암호와 로그인한 유저의 암호화된 비밀번호가 일치하는지 확인
        log.info("비밀번호 체크 하는 곳 member  ");
        Member temp = memberRepository.findByMemberId(member.getUsername());
        log.info("서비스단 password : {}", password);
        log.info("커스텀 멤버 디테일 password : {}", temp.getPassword());
        if (bCryptPasswordEncoder.matches(password, temp.getPassword())) {
            //일치한다면 ok 보내고 일치하지 않으면 에러 발생
            return;
        } else {
            throw new BusinessException(ErrorCode.PASSWORD_DO_NOT_MATCH);
        }
    }

    @Override
    public void changePassword(CustomMemberDetail member, String password, String chkPassword) {
        //멤버가 있는지 확인
        Member temp = memberRepository.findByMemberId(member.getUsername());
        if (temp == null) {
            //없으면 에러 발생
            throw new BusinessException(ErrorCode.ENTITY_NOT_FOUND);
        }
        //새 비밀번호와 새 비밀번호 확인용이 같은지 체크 다르면 에러발생
        if (!password.equals(chkPassword)) {
            throw new BusinessException(ErrorCode.PASSWORD_DO_NOT_MATCH);
        }
        //비밀번호 업데이트
        temp.updatePassword(bCryptPasswordEncoder.encode(password));
    }


}
