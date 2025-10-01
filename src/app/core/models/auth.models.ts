export interface LoginRequest {
username: string;
password: string;
}


export interface TokenPair {
accessToken: string;
refreshToken: string;
}


export interface LoginResponse extends TokenPair {
user: UserSummary;
}


export interface UserSummary {
id: number;
name: string;
email: string;
roles: string[]; // ex.: ["TEACHER", "ADMIN"]
}


export interface JwtPayload {
sub: string;
exp: number; // epoch seconds
iat?: number;
roles?: string[];
[k: string]: unknown;
}
