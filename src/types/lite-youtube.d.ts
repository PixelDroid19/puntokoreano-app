declare namespace JSX {
  interface IntrinsicElements {
    'lite-youtube': {
      videoid: string;
      videotitle?: string;
      videoplay?: string;
      posterquality?: 'maxresdefault' | 'sddefault' | 'mqdefault' | 'hqdefault';
      posterloading?: 'lazy' | 'eager';
      nocookie?: boolean;
      autoload?: boolean;
      autopause?: boolean;
      short?: boolean;
      disablenoscript?: boolean;
      params?: string;
      videoStartAt?: string | number;
      playlistid?: string;
      style?: React.CSSProperties;
      className?: string;
    };
  }
} 