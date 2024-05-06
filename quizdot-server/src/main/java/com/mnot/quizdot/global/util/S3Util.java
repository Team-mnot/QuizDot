package com.mnot.quizdot.global.util;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
@RequiredArgsConstructor
@Slf4j
public class S3Util {
    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket; // 버킷명

    @Value("${cloud.aws.cloudfront.domain}")
    private String cloudFrontDomain; // CloudFront 도메인

    public enum Directory {
        REWARD("reward/"),
        QUIZ("quiz/"),
        CLIENT("client/");

        private final String path;

        Directory(String path) {
            this.path = path;
        }

        public String getPath() {
            return path;
        }
    }

    // 파일 1개 업로드
    public String uploadFile(MultipartFile multipartFile, Directory directory) {
        // 파일 메타 데이터
        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentType(multipartFile.getContentType());
        objectMetadata.setContentLength(multipartFile.getSize());

        // 파일명 생성
        String key = makeFileName(directory.getPath(), multipartFile.getOriginalFilename());

        // S3에 파일 오브젝트 저장
        try {
            amazonS3Client.putObject(bucket, key, multipartFile.getInputStream(), objectMetadata);
        } catch (Exception e) {
            log.error("Error uploading file to S3", e);
        }

        // 파일 URL 생성하여 리턴
        return "https://" + cloudFrontDomain + "/" + key;
    }

    // 파일명을 생성하는 메소드
    public String makeFileName(String directory, String fileName) {
        // 파일명 중복을 방지하기 위해 현재 시간 반영
        String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy_MM_dd_HHmmSS"));
        return directory + time + "_" + fileName;
    }

    public void deleteFile(String url, Directory directory) {

        String prefix = "https://" + cloudFrontDomain + "/";
        int startIdx = url.indexOf(prefix);
        String fileName = url.substring(startIdx + prefix.length());
        try {
            amazonS3Client.deleteObject(directory.getPath(), fileName);
        } catch (Exception e) {
            log.error("Error deleting file from S3", e);
        }
    }
}
