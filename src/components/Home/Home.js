import React, { useContext, useEffect, useState, createRef } from 'react';
import { DogsContext } from '../../contexts/DogsContext';
import axios from 'axios';
import Dog from './Dog';
const Home = () => {
  const scrollToRef = ref => window.scrollTo(0, ref.current.offsetTop); // General scroll to element function

  const [myRefs, setRefs] = useState([]);
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
        var myRefs = [];
        for (let i = 0; i < res.data.Animals.length; i++) {
          myRefs.push(createRef());
        }
        setRefs(myRefs);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [setDogs]);
  const [search, setSearch] = useState('');
  const handleChange = e => {
    setSearch(e.target.value);
  };
  const handleSubmit = e => {
    e.preventDefault();
    var x = 0;
    if (dogs.length > 0) {
      for (let i = 0; i < dogs.length; i++) {
        if (dogs[i].Name.startsWith(search)) {
          x = i;
          break;
        }
      }
      if (x !== 0) scrollToRef(myRefs[x]);
    }
  };
  return (
    <section id='dogs'>
      <div className='search'>
        <form onSubmit={handleSubmit}>
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
        <p>BirthDate</p>
        <p>Is Dangerous</p>
      </div>
      {dogs.map((dog, index) => {
        return <Dog key={dog.ID} dog={dog} myref={myRefs[index]} />;
      })}
    </section>
  );
};

export default Home;
