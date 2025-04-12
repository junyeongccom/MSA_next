'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Gateway API URL
const GATEWAY_API_URL = process.env.NEXT_PUBLIC_GATEWAY_API_URL || 'http://localhost:8000';

export default function Home() {
  const { data: session, status, update } = useSession();
  const isLoading = status === 'loading';
  const [authStatus, setAuthStatus] = useState<{
    isSending: boolean;
    isSuccess: boolean;
    error: string | null;
  }>({
    isSending: false,
    isSuccess: false,
    error: null
  });

  // 토큰을 백엔드로 전송하는 함수 (시나리오 1)
  const sendTokensToBackend = async () => {
    if (!session?.accessToken) {
      console.error('토큰이 없습니다.');
      setAuthStatus({
        isSending: false,
        isSuccess: false,
        error: '토큰이 없습니다.'
      });
      return;
    }

    try {
      setAuthStatus({
        ...authStatus,
        isSending: true,
        error: null
      });

      // 시나리오 1: axios로 gateway에 접근해서 jose에게 access, refresh 토큰을 넘김
      const response = await axios.post(`${GATEWAY_API_URL}/api/auth/token`, {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        expiresAt: session.expiresAt
      });

      console.log('🔄 백엔드로 토큰 전송 성공:', response.data);
      
      // 시나리오 2: jose에서 success를 받으면 이곳에 있는 jwt를 삭제
      if (response.data.success) {
        // NextAuth 세션에서 토큰 정보 삭제 (보안을 위해)
        await update({
          ...session,
          accessToken: null,
          refreshToken: null,
          expiresAt: null
        });
        
        setAuthStatus({
          isSending: false,
          isSuccess: true,
          error: null
        });
        
        console.log('✅ 토큰 정보가 백엔드로 전송되고 클라이언트에서 안전하게 제거되었습니다.');
      }
    } catch (error) {
      console.error('❌ 토큰 전송 실패:', error);
      setAuthStatus({
        isSending: false,
        isSuccess: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      });
    }
  };

  // ✅ 세션이 바뀔 때마다 콘솔 로그 출력
  useEffect(() => {
    if (session) {
      console.log('✅ [Home] 세션 불러오기 완료');
      console.log('👧🏻 Access Token:', session.accessToken);
      console.log('🦣 Refresh Token:', session.refreshToken);
      console.log('⏰ Expires At:', session.expiresAt);
      
      // 세션이 있고 토큰이 있으면 자동으로 백엔드로 토큰 전송
      // 자동 실행을 원치 않는다면 이 부분을 주석 처리하세요
      // if (session.accessToken && !authStatus.isSending && !authStatus.isSuccess) {
      //   sendTokensToBackend();
      // }
    }
  }, [session]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-md">
        <h1 className="text-4xl font-bold text-purple-700 mb-8 text-center">HC</h1>
        
        {isLoading ? (
          <p className="mb-4 text-center">로딩 중...</p>
        ) : session ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="mb-4 text-center">
                <span className="font-bold">{session.user?.name}</span>님 환영합니다!
              </p>
              <p className="mb-4 text-center">
                이메일: {session.user?.email}
              </p>
              
              {/* 토큰 상태 표시 */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-2">토큰 상태:</p>
                <p className="text-xs mb-1">
                  Access Token: {session.accessToken ? '✅ 있음' : '❌ 없음'}
                </p>
                <p className="text-xs">
                  Refresh Token: {session.refreshToken ? '✅ 있음' : '❌ 없음'}
                </p>
              </div>
              
              {/* 토큰 전송 상태 */}
              {authStatus.isSuccess && (
                <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
                  ✅ 토큰이 성공적으로 백엔드로 전송되었습니다.
                </div>
              )}
              
              {authStatus.error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  ❌ 오류: {authStatus.error}
                </div>
              )}
              
              {/* 토큰 전송 버튼 */}
              {session.accessToken && !authStatus.isSuccess && (
                <button
                  onClick={sendTokensToBackend}
                  disabled={authStatus.isSending}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {authStatus.isSending ? "토큰 전송 중..." : "토큰을 백엔드로 전송"}
                </button>
              )}
              
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-6 text-gray-600">
              서비스를 이용하려면 로그인해 주세요.
            </p>
            <Link 
              href="/oauth/login"
              className="px-6 py-3 bg-purple-700 text-white font-semibold rounded-md hover:bg-purple-800 transition-colors inline-block"
            >
              로그인하기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
