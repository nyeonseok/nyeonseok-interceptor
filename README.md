# 🟣 nyeonseok-interceptor

**JWT로그인 환경**에서 `access token`, `refresh token` 인터셉터를 간단하게 사용할 수 있는 라이브러리입니다.  
 **`createApiClient`만 import**하면 바로 사용 가능합니다.

---

## 1️⃣ 설치
**v 1.0.0**

```bash
# 프로젝트에 axios 설치
npm install axios

# nyeonseok-interceptor 라이브러리 설치
npm install nyeonseok-interceptor
```

<br>

## 2️⃣ createApiClient import

```typescript
import { createApiClient } from "nyeonseok-interceptor";
```

<br>

## 3️⃣ 기본 설정 

```typescript
const api = createApiClient({
  // .env에 정의한 기본 경로 변수명 작성, 하드코딩으로 바로 기본 경로 작성해도 무관
  baseURL: import.meta.env.VITE_BASE_URL,,

  // AccessToken을 가져오는 함수 작성, 여기선 localStorage에 저장하고 가져오는 방식 채택
  getAccessToken: () => localStorage.getItem("accessToken"),

  // 요청 Interceptor로 재발급받은 AccessToken을 저장하는 함수 작성.
  setAccessToken: (token) => localStorage.setItem("accessToken", token),

  // RefreshToken을 발급해주는 API 주소 작성
  refreshEndpoint: "/api/auth/refresh",

  // 로그아웃 함수 작성
  onLogout: () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  },
});

```

<br>

## 4️⃣ Interceptor 사용

```typescript
  const fetchUserInfo = async () => {
    try {
      // 통신할 때 앞에 api 붙여주면 됨
      const response = await api.get("api/my-info");
      if (response.status === 200) {
        alert("성공");
      } else {
        const error = await response.data;
        alert(error.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "알 수 없는 오류 발생";
      alert(errorMessage);
    }
  };
```
💡 참고 사항
- JWT 환경에서 사용 가능
- `Refresh Token`을 httpOnly 설정한 환경


<br>

## 5️⃣ 예시 코드

```typescript
import { createApiClient } from "nyeonseok-interceptor";

export default function Profile() {
  const api = createApiClient({
    baseURL: import.meta.env.VITE_BASE_URL,
    getAccessToken: () => localStorage.getItem("accessToken"),
    setAccessToken: (token) => localStorage.setItem("accessToken", token),
    refreshEndpoint: "/api/auth/refresh",
    onLogout: () => {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    },
  });

  const fetchUserInfo = async () => {
    try {
      const response = await api.get("api/my-info");
      if (response.status === 200) {
        alert("성공");
      } else {
        const error = await response.data;
        alert(error.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "알 수 없는 오류 발생";
      alert(errorMessage);
    }
  };
  return <></>;
}
```

<br>
