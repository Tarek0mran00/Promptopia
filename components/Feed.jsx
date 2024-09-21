"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Import useSession from next-auth

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const { data: session } = useSession(); // Get session data

  const [allPosts, setAllPosts] = useState([]);

  // Search states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);



  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();

      setAllPosts(data);
    };

    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  return (
    <section className='feed'>
      {session?.user ? ( // Check if user is logged in
        <>
          <form className='relative w-full flex-center'>
            <input
              type='text'
              placeholder='Search for a tag or a username'
              value={searchText}
              onChange={handleSearchChange}
              required
              className='search_input peer'
            />
          </form>

          {/* All Prompts */}
          {searchText ? (
            <PromptCardList
              data={searchedResults}
              handleTagClick={handleTagClick}
            />
          ) : (
            <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
          )}
        </>
      ) : (
        <p className="text-center">Please sign in to view the prompts.</p>
      )}
    </section>
  );
};

export default Feed;
