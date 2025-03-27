import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import Process from '../components/Home/Process';
import { useEffect } from 'react';

function Home() {
  console.log('Home twice');
  useEffect(() => {
    console.log('Home component mounted'); // Debugging line
  }, []);
  return (
    <div className="min-h-screen bg-white">
        <Hero />
        <Features />
        <Process />
    </div>
  );
}

export default Home;