export type SpacexLaunch = {
  id: string;
  name: string;
  details: string | null;
  date_utc: string;
  success: boolean | null;

  links: {
    webcast: string | null;
    wikipedia: string | null;
    patch: {
      small: string | null;
      large: string | null;
    };
  };

  rocket: string;
  launchpad: string;
};
