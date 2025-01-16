import Header from '../components/Home/Header';
import Footer from '../components/Home/Footer';
import { Outlet } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Outlet/>
      <main>
        <Outlet/>
      </main>
      <Footer />
    </div>
  );
}

export default Home;