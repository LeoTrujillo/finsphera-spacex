export type SpacexLaunch = {
  id: string;
  name: string;
  details: string | null;
  date_utc: string;
  success: boolean | null;
  rocket: string | { name?: string; id?: string };
  launchpad: string | { name?: string; id?: string };

  links: {
    webcast: string | null;
    wikipedia: string | null;
    patch: {
      small: string | null;
      large: string | null;
    };
  };
};
