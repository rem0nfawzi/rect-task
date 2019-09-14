import React, { useContext, useEffect, useState } from 'react';
import { DogsContext } from '../../contexts/DogsContext';
import axios from 'axios';
import Dog from './Dog';

const Home = () => {
  const { dogs, setDogs } = useContext(DogsContext);
  const [shownDogs, setShownDogs] = useState([]);
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
        setShownDogs(res.data.Animals);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [setDogs, setShownDogs]);

  // Handling search input
  const [search, setSearch] = useState('');
  const handleChange = e => {
    setSearch(e.target.value);
    let d = dogs.filter(dog => {
      return dog.Name.startsWith(e.target.value) ? true : false;
    });
    setShownDogs(d);
  };

  return (
    <section id='dogs'>
      <h1>Dogs Info</h1>
      <div className='home-search'>
        <form>
          <input
            type='search'
            value={search}
            onChange={handleChange}
            placeholder='Search Dogs'
          />
        </form>
      </div>
      <div className='dog titles'>
        <p>Name</p>
        <p>Race</p>
        <p>Color</p>
        <p>Age</p>
        <p>BirthDate</p>
        <p>Is Dangerous</p>
      </div>
      {shownDogs.map(dog => {
        return <Dog key={dog.ID} dog={dog} />;
      })}
    </section>
  );
};

export default Home;
