import { useEffect } from 'react';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-fetch';
import { encode } from 'js-base64';

const RestreamPage = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.restream.io/oauth/token', {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${encode(
              '2eebfa0c-3c87-440c-8f35-874424b925d3:6bb49683-e1c0-4b84-9115-ea2bbf930c5a'
            )}`,
            'Access-Control-Allow-Origin': '*',
            // Authorization:
            //   'Basic MmVlYmZhMGMtM2M4Ny00NDBjLThmMzUtODc0NDI0YjkyNWQzOjZiYjQ5NjgzLWUxYzAtNGI4NC05MTE1LWVhMmJiZjkzMGM1YQ==',
            // 'Access-Control-Allow-Headers': 'Authorization, Content-Type',
          },
          body: `grant_type=authorization_code&redirect_uri=http://localhost:3000/restream&code=${router.query.code}`
          // body: JSON.stringify({
          //   grant_type: 'authorization_code',
          //   redirect_uri: 'http://localhost:3000/home',
          //   code: router.query.code,
          // }),
        });
        const json = await response.json();
        console.log({ json });
      } catch (error) {
        console.log({ error });
      }
    };
    if (router.query.code) fetchData();

    // curl -X POST -H "Content-Type: application/x-www-form-urlencoded" --user 2eebfa0c-3c87-440c-8f35-874424b925d3:6bb49683-e1c0-4b84-9115-ea2bbf930c5a --data "grant_type=authorization_code&redirect_uri=http://localhost:3000/restream&code=92e0fa9a451d38a57d872e890066a4675099ddb4" https://api.restream.io/oauth/token
  }, [router]);

  return (
    <>
      <h1>Restream login</h1>
    </>
  );
};

export default RestreamPage;
