import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import Layout from '../components/Layout';

const IndexPage = () => {
  const videoRef = useRef(null);
  const playbackId = 'o2krrNTBDIeUy2GCBp6XxZiodDDh7b0202e2qsWDoV402k';
  const src = `https://stream.mux.com/${playbackId}.m3u8`;

  useEffect(() => {
    let hls;
    if (videoRef.current) {
      const video = videoRef.current;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Some browers (safari and ie edge) support HLS natively
        video.src = src;
      } else if (Hls.isSupported()) {
        // This will run in all other modern browsers
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        console.error("This is a legacy browser that doesn't support MSE");
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoRef]);

  return (
    <>
      <h1>Hello Next.js 👋</h1>

      <video
        controls
        ref={videoRef}
        style={{ width: '100%', maxWidth: '500px' }}
      />
    </>
  );
};

export default IndexPage;
