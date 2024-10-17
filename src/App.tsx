import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import Search from './pages/Search/Search'
import { dbConfig } from './utils/dbConfig';
import { initDB } from 'react-indexed-db-hook';



initDB(dbConfig);
function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <Search />
    </QueryClientProvider>
  )
}

export default App
