import React, { useContext, useEffect } from 'react';
import { DogsContext } from '../../contexts/DogsContext';
import axios from 'axios';
import Dog from './Dog';

const Home = () => {
  const { dogs, setDogs } = useContext(DogsContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const body = { Token: 'token_remon', Type: 'Dog' };
        const res = await axios.post(
          'http://a.payclick.co.il/api/sample/GetAnimals',
          body,
          config
        );
        setDogs(res.data.Animals);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [setDogs]);
  return (
    <section id='dogs'>
      <div className='dog titles'>
        <p>Name</p>
        <p>Race</p>
        <p>Color</p>
        <p>BirthDate</p>
        <p>Is Dangerous</p>
      </div>
      {dogs.map(dog => (
        <Dog key={dog.ID} dog={dog} />
      ))}
    </section>
  );
};

export default Home;
