"use client";

import React, { useState, FormEvent, ChangeEvent} from "react";
import { signIn} from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`입력한 이메일: ${email}`);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    console.log("🚀 로그인 시작");
    signIn('google', { callbackUrl: '/' });
  };

  const handleNaverLogin = () => {
    alert("네이버 로그인은 아직 준비 중입니다!");
  };

  const handleKakaoLogin = () => {
    alert("카카오 로그인은 아직 준비 중입니다!");
  };

  // 모든 버튼에 적용할 공통 클래스
  const buttonClasses = "w-full py-3 rounded-md font-semibold flex items-center justify-center transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-md">
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-700 mb-2">HC</div>
          <h1 className="text-2xl font-bold">먼저 이메일부터 입력해 보세요</h1>
          <p className="text-sm text-gray-600 mt-1">
            직장에서 사용하는 <span className="font-medium text-gray-800">이메일 주소</span>로 로그인하는 걸 추천드려요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="name@work-email.com"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-purple-700 text-white font-semibold rounded-md hover:bg-purple-800"
          >
            계속
          </button>
        </form>

        <div className="flex items-center justify-center space-x-2 text-gray-400">
          <span className="block w-16 h-px bg-gray-200"></span>
          <span className="text-sm">또는</span>
          <span className="block w-16 h-px bg-gray-200"></span>
        </div>

        <div className="space-y-3">
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            type="button"
            className={`${buttonClasses} border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-70`}
          >
            <img src="/images/google.svg" alt="Google" className="w-5 h-5 mr-2" />
            <span>{isLoading ? "로그인 중..." : "Google 계정으로 로그인"}</span>
          </button>
          <button 
            onClick={handleNaverLogin}
            type="button"
            className={`${buttonClasses} bg-[#03C75A] text-white hover:bg-[#02b351]`}
          >
            <span className="text-2xl font-bold mr-2">N</span>
            <span>네이버 로그인</span>
          </button>
          <button 
            onClick={handleKakaoLogin}
            type="button"
            className={`${buttonClasses} bg-[#FEE500] text-[#000000] hover:bg-[#FDD800]`}
          >
            <span className="mr-2">
              <svg width="18" height="17" viewBox="0 0 18 17">
                <path fill="#000000" d="M9 0C4.0294 0 0 3.09049 0 6.90607C0 9.43322 1.67813 11.6455 4.21591 12.8449C4.07295 13.3241 3.43295 15.2461 3.40682 15.3827C3.40682 15.3827 3.37614 15.5665 3.49432 15.6352C3.6125 15.7037 3.76136 15.6486 3.76136 15.6486C3.91023 15.6211 6.3375 13.9065 6.82614 13.5563C7.52955 13.6802 8.25545 13.7462 9 13.7462C13.9706 13.7462 18 10.6557 18 6.84017C18 3.02466 13.9706 0 9 0Z"/>
              </svg>
            </span>
            <span>카카오 로그인</span>
          </button>
        </div>
      </div>
    </div>
  );
}
