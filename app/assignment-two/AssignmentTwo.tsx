import { useEffect, useState } from 'react';

const API_ENDPOINT = "https://dummyjson.com";

export function WillRender({ when, children }: { when: boolean, children: React.ReactNode }) {
  return (
    when ? children : null
  );
}

const REQUEST_LIMITATION = 200;

export function FilterList({ products, users, likeObject, onClickLike }: { products: any[], users: any[], likeObject: Record<string, boolean>, onClickLike: (productId: string) => void }) {

  return (
    <div className="flex flex-col gap-4">
      {products.map((product) => ( <div key={product.id} className="flex flex-col gap-2 border-2 border-gray-300 rounded-md p-2">
        <div className="font-bold">{product.id} - {product.title}</div>
        <div className="text-sm text-gray-500">{product.description}</div>
        <img src={product.images[0]} alt={product.title} className="w-36 h-36" />
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 items-center">
            <img src={users[Number(product.id) - 1].image} alt={users[Number(product.id) - 1].firstName} className="w-10 h-10 rounded-full" />
            <div className="font-bold">{users[Number(product.id) - 1].firstName} {users[Number(product.id) - 1].lastName}</div>
          </div>
          <div>
            <WillRender when={!likeObject[product.id]}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer" onClick={() => onClickLike(product.id)}>Like</button>
            </WillRender>
            <WillRender when={likeObject[product.id]}>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer" onClick={() => onClickLike(product.id)}>Unlike</button>
            </WillRender>
          </div>
          </div>
      </div> ))}
    </div>
  );
}

export function AssignmentTwo() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [likeObject, setLikeObject] = useState<Record<string, boolean>>({});

  const hasValidData = users.length > 0 && products.length > 0;
  const hasFilteredData = filteredData.length > 0;
  const hasSearch = search.length > 0;

  const onClickLike = (productId: string) => {
    setLikeObject((prev) => ({ ...prev, [productId]: !prev[productId] }));
  }

  const fetchData = async () => {
    try {
      const responses = await Promise.all([
      fetch(`${API_ENDPOINT}/users?limit=${REQUEST_LIMITATION}`),
      fetch(`${API_ENDPOINT}/products?limit=${REQUEST_LIMITATION}`),
    ]);
    const usersData = await responses[0].json();
    const productsData = await responses[1].json();
    setUsers(usersData.users);
    setProducts(productsData.products);
    } catch (error) {
      console.error('[AssignmentTwo] Error fetching data', error);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center p-8 gap-8 h-screen">
      <input className="border-2 border-gray-300 rounded-md p-2" type="text" onChange={(e) => setSearch(e.target.value)} placeholder="Search" disabled={loading || !hasValidData} />
      <WillRender when={loading}>Loading...</WillRender>
      <WillRender when={!loading}>
        <WillRender when={hasSearch}>
          <WillRender when={!hasFilteredData}>No filtered data found</WillRender>
          <WillRender when={hasFilteredData}><FilterList products={filteredData} users={users} likeObject={likeObject} onClickLike={onClickLike} /></WillRender>
        </WillRender>
        <WillRender when={!hasSearch}>
          <WillRender when={!hasValidData}>No data found</WillRender>
          <WillRender when={hasValidData}><FilterList products={products} users={users} likeObject={likeObject} onClickLike={onClickLike} /></WillRender>
        </WillRender>
      </WillRender>
    </div>
  );
}
