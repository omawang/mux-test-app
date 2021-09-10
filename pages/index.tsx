import { GetServerSideProps, NextPage } from 'next';
import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import Layout from '../components/Layout';
import Mux, { JWT } from '@mux/mux-node';

const IndexPage: NextPage<{ playbackId: string; token: string }> = ({ playbackId, token }) => {
  const videoRef = useRef(null);

  const src = `https://stream.mux.com/${playbackId}.m3u8?token=${token}`;

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

      <video controls ref={videoRef} style={{ width: '100%', maxWidth: '500px' }} />
    </>
  );
};

export default IndexPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { Video } = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET);
  const signedPlayback = await Video.Assets.createPlaybackId(
    'KAgCVZ8XwvmjoPl1LxvPx8YAh4H02MeGpmXCNuvQN65w',
    { policy: 'signed' }
  );

  const signingKey = await Video.SigningKeys.create();
  
  const baseOptions = {
    keyId: signingKey.id, // Enter your signing key id here
    keySecret: signingKey.private_key, // Enter your base64 encoded private key here
    expiration: '1d', // E.g 60, "2 days", "10h", "7d", numeric value interpreted as seconds
  };
  const finalToken = JWT.sign(signedPlayback.id, {
    ...baseOptions,
    type: 'video',
  });

  return {
    props: {
      playbackId: signedPlayback.id,
      token: finalToken,
    },
  };
};
