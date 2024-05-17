package com.mnot.quizdot.domain.member.controller;

import com.mnot.quizdot.domain.member.dto.CustomMemberDetail;
import com.mnot.quizdot.domain.member.dto.JoinDto;
import com.mnot.quizdot.domain.member.dto.RefreshToken;
import com.mnot.quizdot.domain.member.repository.RefreshTokenRedisRepository;
import com.mnot.quizdot.domain.member.service.MemberService;
import com.mnot.quizdot.global.jwt.JWTUtil;
import com.mnot.quizdot.global.result.ResultResponse;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import io.jsonwebtoken.ExpiredJwtException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/member")
@Validated
@Tag(name = "Member", description = "멤버 API")
@Slf4j
public class MemberController {

    private final MemberService memberService;
    private final JWTUtil jwtUtil;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;

    /**
     * 회원 가입
     */
    @PostMapping("/join")
    @Operation(summary = "회원 가입")
    public ResponseEntity<ResultResponse> joinMember(
        @RequestBody @Valid JoinDto joinDTO) {

        log.info("회원 가입 URL 맵핑 : OK");

        memberService.joinMember(joinDTO);

        log.info("회원 가입 : COMPLETE");

        return ResponseEntity.ok(ResultResponse.of(200, "회원가입 성공"));
    }

    /**
     * 닉네임 중복 체크
     */
    @GetMapping("/check-nickname")
    @Operation(summary = "닉네임 중복 체크")
    public ResponseEntity<ResultResponse> checkNickname(@RequestParam String nickname) {
        if (!memberService.checkNickname(nickname)) {
            return ResponseEntity.ok(ResultResponse.of(200, "사용할 수 있는 닉네임입니다."));
        } else {
            return ResponseEntity.ok(ResultResponse.of(409, "이미 존재하는 닉네임입니다."));
        }
    }

    /**
     * 아이디 중복 체크
     */
    @GetMapping("/check-id")
    @Operation(summary = "아이디 중복 체크")
    public ResponseEntity<ResultResponse> checkId(@RequestParam String id) {
        if (!memberService.checkId(id)) {
            return ResponseEntity.ok(ResultResponse.of(200, "사용할 수 있는 아이디입니다."));
        } else {
            return ResponseEntity.ok(ResultResponse.of(409, "이미 존재하는 아이디입니다."));
        }
    }


    /**
     * 회원 탈퇴
     */
    @DeleteMapping("")
    @Operation(summary = "회원 탈퇴")
    public ResponseEntity<ResultResponse> deleteMember(
        HttpServletResponse response,
        @AuthenticationPrincipal CustomMemberDetail customMemberDetail,
        @RequestParam int channelId) {
        memberService.deleteMember(customMemberDetail, channelId);

        // refresh 토큰을 Cookie에서 삭제
        deleteCookie("refresh", response);
        return ResponseEntity.ok(ResultResponse.of(200, "회원 탈퇴가 완료되었습니다."));
    }

    /**
     * 비밀번호 찾기
     */
    @PostMapping("")
    @Operation(summary = "비밀번호 힌트 체크하기")
    public ResponseEntity<ResultResponse> chkHint(
        @RequestBody Map<String, String> requestBody) {
        String memberId = requestBody.get("memberId");
        String hint = requestBody.get("hint");
        memberService.chkHint(memberId, hint);
        return ResponseEntity.ok(ResultResponse.of(200, "비밀번호 힌트가 일치합니다."));
    }

    /**
     * 비밀번호 찾기 후 비밀번호 설정
     */
    @PostMapping("/pwd")
    @Operation(summary = "비밀번호 힌트 확인 후 비밀번호 설정")
    public ResponseEntity<ResultResponse> findPassword(
        @RequestBody Map<String, String> requestBody) {
        String memberId = requestBody.get("memberId");
        String password = requestBody.get("password");
        String passwordChk = requestBody.get("passwordChk");
        memberService.findPassword(memberId, password, passwordChk);
        return ResponseEntity.ok(ResultResponse.of(200, "비밀번호 찾기 완료됐습니다."));
    }

    /**
     * 로그인 후 비밀번호 변경을 위한 비밀번호 확인
     */
    @PostMapping("/info/pwd-check")
    @Operation(summary = "기존 비밀번호 확인")
    public ResponseEntity<ResultResponse> checkPassword(
        @AuthenticationPrincipal CustomMemberDetail customMemberDetail,
        @RequestBody Map<String, String> requestBody) {
        String password = requestBody.get("password");
        memberService.checkPassword(customMemberDetail, password);
        return ResponseEntity.ok(ResultResponse.of(200, "비밀번호가 확인 되었습니다."));
    }

    /**
     * 로그인 후 비밀번호 변경
     */
    @PostMapping("/info/pwd")
    @Operation(summary = "비밀번호 변경")
    public ResponseEntity<ResultResponse> modifyPassword(
        @AuthenticationPrincipal CustomMemberDetail customMemberDetail,
        @RequestBody Map<String, String> requestBody) {
        String password = requestBody.get("password");
        String chkPassword = requestBody.get("chkPassword");
        memberService.modifyPassword(customMemberDetail, password, chkPassword);
        return ResponseEntity.ok(ResultResponse.of(200, "비밀번호가 변경되었습니다."));
    }

    /**
     * 유저 정보 조회
     */
    @GetMapping("/info/{member_id}")
    @Operation(summary = "유저 정보 조회")
    public ResponseEntity<ResultResponse> getInfo(
        @PathVariable("member_id") int memberId) {
        return ResponseEntity.ok(
            ResultResponse.of(200, "유저 정보를 조회했습니다", memberService.getInfo(memberId)));
    }

    /**
     * 닉네임 변경
     */
    @PostMapping("/nickname")
    @Operation(summary = "닉네임 변경")
    public ResponseEntity<ResultResponse> modifyNickname(
        @AuthenticationPrincipal CustomMemberDetail customMemberDetail,
        @RequestBody Map<String, String> requestBody) {
        String nickname = requestBody.get("nickname");
        memberService.modifyNickname(customMemberDetail, nickname);
        return ResponseEntity.ok(ResultResponse.of(200, "닉네임을 변경했습니다."));
    }

    /**
     * 캐릭터 변경
     */
    @PostMapping("/character/{character_id}")
    @Operation(summary = "캐릭터 변경")
    public ResponseEntity<ResultResponse> modifyCharacter(
        @AuthenticationPrincipal CustomMemberDetail customMemberDetail,
        @PathVariable("character_id") int characterId) {
        memberService.modifyCharacter(customMemberDetail, characterId);
        return ResponseEntity.ok(ResultResponse.of(200, "캐릭터를 변경했습니다."));
    }

    /**
     * 칭호 변경
     */
    @PostMapping("/title/{title_id}")
    @Operation(summary = "칭호 변경")
    public ResponseEntity<ResultResponse> modifyTitle(
        @AuthenticationPrincipal CustomMemberDetail customMemberDetail,
        @PathVariable("title_id") int titleId) {
        return ResponseEntity.ok(ResultResponse.of(200, "칭호를 변경했습니다.",
            memberService.modifyTitle(customMemberDetail, titleId)));
    }

    /**
     * 캐릭터 뽑기
     */
    @PostMapping("/reward/random-pick/character")
    @Operation(summary = "캐릭터 뽑기")
    public ResponseEntity<ResultResponse> gachaCharacter(
        @AuthenticationPrincipal CustomMemberDetail customMemberDetail) {
        return ResponseEntity.ok(
            ResultResponse.of(200, "캐릭터 뽑기에 성공했습니다.",
                memberService.gachaCharacter(customMemberDetail)));
    }

    /**
     * 닉네임 색상뽑기
     */
    @PostMapping("/reward/random-pick/color")
    @Operation(summary = "닉네임 색상 뽑기")
    public ResponseEntity<ResultResponse> gachaColor(
        @AuthenticationPrincipal CustomMemberDetail customMemberDetail
    ) {
        return ResponseEntity.ok(ResultResponse.of(200, "닉네임 색상 뽑기에 성공했습니다.",
            memberService.gachaColor(customMemberDetail)));
    }


    /**
     * accessToken 재발급
     */
    @PostMapping("/reissue")
    @Operation(summary = "access 토큰 재발급")
    public ResponseEntity<ResultResponse> reissue(HttpServletRequest request,
        HttpServletResponse response) {

        log.info("access 토큰 재발급 : START");
        //refresh 토큰 가져오기
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("refresh")) {
                refresh = cookie.getValue();
            }
        }

        log.info("쿠키에서 꺼낸 refresh 토큰 : {}", refresh);
        //refreshToken이 존재하지 않음
        if (refresh == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_REFRESH_TOKEN);
        }

        log.info("refreshToken이 있나요?");

        //refreshToken 만료확인
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            throw new BusinessException(ErrorCode.EXPIRED_REFRESH_TOKEN);
        }

        log.info("만료되었나요?");

        //refreshToken인지 확인
        String category = jwtUtil.getCategory(refresh);
        if (!category.equals("refresh")) {
            throw new BusinessException(ErrorCode.IS_NOT_REFRESH_TOKEN);
        }

        log.info("refreshToken이 맞나요?");

        //유저 아이디와 role 가져오기
        String memberId = jwtUtil.getUsername(refresh);
        String role = jwtUtil.getRole(refresh);
        int id = jwtUtil.getId(refresh);
        String nickname = jwtUtil.getNickname(refresh);

        //redis에 refreshToken이 있는지 확인
        Boolean isExist = refreshTokenRedisRepository.existsById(memberId);
        if (!isExist) {
            throw new BusinessException(ErrorCode.NOT_FOUND_REFRESH_TOKEN);
        }
        log.info("redis에 있는지 확인 : {}", isExist);

        //새 토큰 발급
        String newAccessToken = jwtUtil.createJwt("access", id, memberId, role, nickname,
            10800000L);
        String newRefreshToken = jwtUtil.createJwt("refresh", id, memberId, role, nickname,
            64800000L);

        //기존 refreshToken redis에서 삭제
        refreshTokenRedisRepository.deleteById(memberId);
        //새 refreshToken 저장하기
        RefreshToken refreshToken = RefreshToken.builder()
            .memberId(memberId)
            .refreshToken(refresh)
            .build();
        refreshTokenRedisRepository.save(refreshToken);

        //access는 헤더에 담아주기, refresh는 쿠키에 담아주기
        response.setHeader("access", newAccessToken);
        response.addCookie(createCookie("refresh", newRefreshToken));

        log.info("access 토큰 재발급 : COMPLETE");
        return ResponseEntity.ok(ResultResponse.of(200, "accessToken 재발급 완료"));
    }


    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24 * 60 * 60);
        cookie.setHttpOnly(true);

        return cookie;
    }

    private Cookie deleteCookie(String key, HttpServletResponse response) {
        Cookie cookie = new Cookie("refresh", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
        return cookie;
    }
}


