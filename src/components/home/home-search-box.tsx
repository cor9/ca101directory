"use client";

import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function HomeSearchBox() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    router.push(`/search?q=${searchTerm}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center justify-center">
      <Input type="text"
        placeholder="Search any AI tools, GPTs, websites, etc."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-[320px] sm:w-[480px] md:w-[640px] h-12 rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary focus:border-2"
      />
      <Button type="submit"
        className="rounded-l-none size-12"
      >
        <SearchIcon className="size-5" aria-hidden="true" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}