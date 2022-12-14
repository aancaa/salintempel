import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Header from '../components/Header';
import ItemSalinTempel from '../components/ItemSalinTempel';
import Layout from '../components/Layout';
import { useGetMyFavorites } from '../query-hooks/useSalinTempel';

const Favorites = () => {
  const { data, isLoading } = useGetMyFavorites();
  if (isLoading)
    return (
      <AiOutlineLoading3Quarters className="animate-spin text-4xl mx-auto text-slate-800 text-center pt-10" />
    );
  return (
    <Layout title="Favorites">
      <Header />
      {data?.data.length === 0 && (
        <section>
          <>
            <img
              height={200}
              width={200}
              className="mx-auto mt-10"
              src="/confused-stickman.svg"
              alt="empty-state"
            />
            <p className="text-sm text-zinc-100 text-center mt-2">
              No data in favorites
            </p>
          </>
        </section>
      )}
      <section className="space-y-5 pt-10 pb-24">
        {data?.data.map((item) => (
          <ItemSalinTempel key={item._id} {...item} />
        ))}
      </section>
    </Layout>
  );
};

export default Favorites;
