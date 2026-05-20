export interface CodingProfiles {
  github: string;
  linkedin: string;
  hackerrank: string;
  leetcode: string;
  codechef: string;
  gfg: string;
  portfolio: string;
  codolio: string;
  twitter: string;
}

export const EMPTY_PROFILES: CodingProfiles = {
  github: "",
  linkedin: "",
  hackerrank: "",
  leetcode: "",
  codechef: "",
  gfg: "",
  portfolio: "",
  codolio: "",
  twitter: "",
};

export const PROFILE_STORAGE_KEY = "campus-coding-profiles";
