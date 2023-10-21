"use client";
import axios from "axios";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { BiBookAlt, BiSearch } from "react-icons/bi";
import { FaPause } from "react-icons/fa";
import { BsFillPlayFill } from "react-icons/bs";
import { GiOpenBook } from "react-icons/gi";
import { BsFillMoonFill } from "react-icons/bs";
import { PiSunDimLight } from "react-icons/pi";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [mode, setMode] = useState("");
  const [word, setWord] = useState("");
  const [data, setData] = useState<any>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("mode")) {
      localStorage.setItem("mode", "light");
      return setMode("light");
    }
    setMode(localStorage.getItem("mode")!);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.addEventListener("ended", () => {
      setStart(false);
    });

    if (start) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [start]);

  const search = async () => {
    if (!word.trim()) return;
    try {
      const res = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const response = await res.data;

      if (response.status === 404) {
        setData(false);
      } else {
        setData(response[0]);
      }
    } catch (e) {
      console.log(e);
      setData(false);
    }
  };

  return (
    <div
      className={`${
        mode === "light" ? "bg-gray-50 text-black" : "bg-gray-900 text-white"
      } w-full min-h-screen h-full mx-auto`}
    >
      <div className="w-full px-6 lg:w-3/5 mx-auto">
        <header className="flex h-24 justify-between items-center py-4">
          <BiBookAlt className="text-4xl text-gray-400" />
          {mode === "light" ? (
            <BsFillMoonFill
              onClick={() => {
                localStorage.setItem("mode", "dark");
                setMode("dark");
              }}
              className="text-gray-400 text-xl cursor-pointer"
            />
          ) : (
            <PiSunDimLight
              onClick={() => {
                localStorage.setItem("mode", "light");
                setMode("light");
              }}
              className={`text-gray-400 text-2xl cursor-pointer`}
            />
          )}
        </header>
        <section className="w-full">
          <div className="relative mb-6">
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  search();
                }
              }}
              value={word}
              onChange={(e) => {
                setWord(e.target.value);
                setData(null);
              }}
              type="text"
              placeholder="type any word"
              className="w-full bg-gray-300 outline-none py-4 px-6 rounded placeholder:font-normal placeholder:text-gray-600 text-black font-semibold"
            />
            <BiSearch
              onClick={search}
              className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-xl text-main-100"
            />
          </div>
          {/* info */}
          {data === false ? (
            <div className="text-2xl text-center mt-20">
              There is no result to <span className="font-bold">{word}</span>
            </div>
          ) : data ? (
            <div className="relative flex flex-col">
              <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold capitalize mb-2">
                  {data.word}
                </h1>
                <audio
                  ref={audioRef}
                  src={
                    data.phonetics.find((e: any) => e.audio.length > 0).audio
                  }
                ></audio>
                <div
                  onClick={() => setStart(!start)}
                  className="w-14 h-14 cursor-pointer rounded-full bg-main-50 flex items-center justify-center"
                >
                  {start ? (
                    <FaPause className="text-main-100 text-xl" />
                  ) : (
                    <BsFillPlayFill className="text-main-100 text-3xl" />
                  )}
                </div>
              </div>
              <span className="text-main-100 mb-6">{data.phonetic}</span>
              <span className="font-semibold text-xl mb-4">noun</span>
              <span className="text-xl text-gray-600 font-light mb-3">
                Meaning
              </span>
              <ul className="pl-12 mb-6">
                {data.meanings[0].definitions.map((e: any) => {
                  return (
                    <li className="relative mb-2 before:content-['•'] before:text-main-100 before:absolute before:-left-6 before:-translate-y-[2px] before:text-xl">
                      {e.definition}
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center mb-8 flex-wrap">
                <span className="text-xl font-light text-gray-600 mr-2">
                  Synonyms
                </span>
                {data.meanings[0].synonyms.map((e: string) => {
                  return (
                    <span className="text-main-100 font-bold text-lg mr-2">
                      {e}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <GiOpenBook className="text-[250px] text-gray-400" />
              <p className="text-gray-600">Search of a word </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
