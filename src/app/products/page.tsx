'use client';
import {AddBtn, Card, StatsCard} from '@/components';
import {publicClient} from '@/config';
import {FarcasterIcon} from '@/icons';
import {podsABI, podsContractAddress} from '@/utils';
import {usePrivy, useWallets} from '@privy-io/react-auth';
import {NextPage} from 'next';
import {useEffect, useState} from 'react';
import {formatEther} from 'viem';

const statsData = [
  {
    label: 'Total Products',
    desc: 'Total number of products you have in your store',
    value: 16,
  },
  {
    label: 'Total Sales',
    desc: 'Total number of products sold',
    value: 9,
  },
  {
    label: 'Total Revenue',
    desc: 'Total revenue generated from sales',
    value: '$569',
  },
];

interface Products {
  name: string;
  price: string;
  supply: string;
  productAddress: string;
  image: string;
}

const Products: NextPage = () => {
  const [productsData, setProductsData] = useState<any>();
  const [products, setProducts] = useState<any>([]);
  const {wallets} = useWallets();
  const {user} = usePrivy();

  const readData = async () => {
    if (user) {
      const wallet = wallets[0]?.address;
      try {
        const productsData = await publicClient.readContract({
          address: podsContractAddress,
          abi: podsABI,
          functionName: 'getProducts',
          args: [wallet],
        });
        console.log(productsData);
        setProductsData(productsData);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const fetchData = async () => {
    let products: Products[] = [];
    for (let product of productsData as any[]) {
      products.push({
        name: product.productName,
        price: formatEther(BigInt(product.price)),
        supply: product.supply.toString(),
        productAddress: product.productAddress,
        image: product.previewImageURI,
      });
    }
    setProducts(products as any);
    console.log(products);
  };

  useEffect(() => {
    if (productsData) {
      fetchData();
    }
  }, [productsData]);

  useEffect(() => {
    readData();
  }, [user]);

  return (
    <div className="flex-1 w-full pt-40 pb-5 px-5 md:px-40 overflow-visible flex flex-col justify-start items-start">
      <div className="w-full flex flex-col justify-evenly items-center gap-8 relative">
        <div className="relative flex place-items-center before:absolute before:h-[50px] before:w-[180px] sm:before:h-[200px] md:before:w-[780px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[200px] sm:after:h-[180px] sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-teal-200 after:via-teal-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-teal-500 before:dark:opacity-10 after:dark:from-teal-400 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[260px] z-[-1]">
          <h1 className="text-5xl lg:text-6xl text-white font-title">Your growth</h1>
        </div>
        {user ? (
          <>
            <div className="w-full flex flex-col sm:flex-row justify-end items-center z-0">
              <AddBtn />
            </div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 justify-evenly items-center gap-4">
              {statsData.map((item) => {
                return <StatsCard key={item.label} {...item} />;
              })}
            </div>
            <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-8">
              {products.length === 0 ? (
                <p className="text-teal-400 text-lg">No products listed yet.</p>
              ) : (
                products.map((product: any, index: any) => (
                  <Card
                    key={index}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    link={product.productAddress}
                    label={
                      <span className="flex flex-row gap-2">
                        Share on <FarcasterIcon className="w-6 h-6" />
                      </span>
                    }
                  />
                ))
              )}
            </div>
          </>
        ) : (
          <h1 className="text-2xl font-primary text-amber-400">Please connect Farcaster!!</h1>
        )}
      </div>
    </div>
  );
};

export default Products;
