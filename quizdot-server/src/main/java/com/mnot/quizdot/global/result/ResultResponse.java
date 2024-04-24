package com.mnot.quizdot.global.result;

import lombok.Getter;

@Getter
public class ResultResponse {

    private final int status;
    private final String message;
    private final Object data;

    private ResultResponse(int status,String message, Object data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    public static ResultResponse of(int status, String message, Object data) {
        return new ResultResponse(status,message, data);
    }

    public static ResultResponse of(int status,String message) {
        return new ResultResponse(status, message, "");
    }

}
