import { Outlet } from 'react-router-dom';
import Header from '../components/Home/Header';
import Footer from '../components/Home/Footer';

export function Container() {
  return (
    <div>
      <Header />
      <main>
        <Outlet /> {/* This is where the nested routes will be rendered */}
      </main>
      <Footer />
    </div>
  );
}


