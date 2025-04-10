import { Route, Routes } from 'react-router';
import Layout from './layout';
import Home from './pages/Home';
import '../styles/globals.css';
import Vocab from './pages/Vocab';
import Lesson from './pages/Lesson';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Home />} />
        <Route path='vocabularies/:vocabId' element={<Vocab />} />
        <Route path='lesson/:vocabId' element={<Lesson />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  )
}
