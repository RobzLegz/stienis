import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PageModule from "../src/modules/PageModule";
import { getRandomNumber } from "../src/utils/generateRandomBetween";

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [takingCredit, setTakingCredit] = useState(false);
  const [setFinished, setSetFinished] = useState(false);
  const [counter, setCounter] = useState(0);
  const [gambling, setGambling] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [timerRef, setTimerRef] = useState(3);
  const [win, setWin] = useState(null);
  const [minCredit, setMinCredit] = useState(null);
  const [is300, setIs300] = useState(0);
  const [currentGirl, setCurrentGirl] = useState(getRandomNumber(1, 12));

  const dataLoadedRef = useRef(false);

  const switchTurns = () => {
    setCurrentPlayer(
      currentPlayer + 1 < players.length ? currentPlayer + 1 : 0
    );

    setGambling(false);
    setMinCredit(null);
    setSetFinished(false);
    setTakingCredit(false);
    setCounter(0);
    setTimerRef(3);
    setWin(null);

    let nextGirl = getRandomNumber(1, 12);

    while (nextGirl === currentGirl) {
      nextGirl = getRandomNumber(1, 12);
    }

    setCurrentGirl(nextGirl);

    let total = 0;

    players.forEach((pl) => {
      total += pl.score;
    });

    setIs300(total);

    if (total >= 300) {
      localStorage.removeItem("data");
    }
  };

  useEffect(() => {
    if (!dataLoadedRef.current) {
      dataLoadedRef.current = true;

      const data = localStorage.getItem("data");
      if (data) {
        const parsedData = JSON.parse(data);
        setPlayers(parsedData.players);
        setGameStarted(parsedData.gameStarted);
        setTakingCredit(parsedData.takingCredit);
        setSetFinished(parsedData.setFinished);
        setCounter(parsedData.counter);
        setGambling(parsedData.gambling);
        setCurrentPlayer(parsedData.currentPlayer);
        setTimerRef(parsedData.timerRef);
        setWin(parsedData.win);
        setMinCredit(parsedData.minCredit);
        setIs300(parsedData.is300);
      }
    }
  }, []);

  useEffect(() => {
    const data = {
      players,
      gameStarted,
      takingCredit,
      setFinished,
      counter,
      gambling,
      currentPlayer,
      timerRef,
      win,
      minCredit,
      is300,
    };

    localStorage.setItem("data", JSON.stringify(data));
  }, [
    players,
    gameStarted,
    takingCredit,
    setFinished,
    counter,
    gambling,
    currentPlayer,
    timerRef,
    win,
    minCredit,
    is300,
  ]);

  useEffect(() => {
    if (gambling) {
      if (timerRef === 0) {
        const random = getRandomNumber(1, 2);

        setWin(random === 2);
      } else {
        setTimeout(() => {
          setTimerRef(timerRef - 1);
        }, 1000);
      }
    }
  }, [gambling, timerRef]);

  const CurrentBG = () => {
    return (
      <Image
        src={`/resources/${currentGirl}.jpg`}
        alt="Anime girl"
        width={400}
        height={800}
        className="w-full h-full object-cover"
      />
    );
  };

  if (is300 >= 300) {
    return (
      <PageModule
        title="300"
        className="w-full h-screen flex flex-col items-start justify-start"
      >
        <CurrentBG />

        <div className="absolute top-0 left-0 flex h-full flex-col items-center justify-center w-full bg-black/40">
          <strong className="text-6xl text-white mb-4">300</strong>

          {players.map((player, i) => (
            <div
              className="flex w-full p-4 border-b items-center justify-between text-white"
              key={i}
            >
              <strong>{player.name}</strong>

              <strong>{player.score}</strong>
            </div>
          ))}
        </div>
      </PageModule>
    );
  }

  if (gambling) {
    return (
      <PageModule
        title="300"
        className="w-full h-screen flex flex-col items-start justify-start"
      >
        <CurrentBG />

        <div className="absolute top-0 left-0 flex h-full flex-col items-center justify-center w-full bg-black/40">
          <div className="flex w-full items-center justify-center p-2 border-b">
            <strong className="text-xl text-white">
              {players[currentPlayer].name} - {players[currentPlayer].score}
            </strong>
          </div>

          <div className="flex h-full flex-col items-center justify-center w-full relative">
            <strong className="text-5xl text-white">Score : {counter}</strong>

            {timerRef ? (
              <strong className="text-red-500 text-4xl mt-4">{timerRef}</strong>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 mt-4">
                <strong className="text-pink-600 text-4xl">
                  {win ? "You Win" : "You Lose"}
                </strong>
                <button
                  className="w-20 h-20 rounded-md bg-red-500 text-4xl opacity-90 text-white"
                  onClick={() => {
                    let currentCounter = counter;

                    if (takingCredit) {
                      if (counter >= minCredit) {
                        const add = (counter - minCredit) * 2;

                        currentCounter += add;
                      } else {
                        const add = (counter - minCredit) * 3;

                        currentCounter += add;
                      }
                    }

                    if (win) {
                      setPlayers(
                        players.map((player, i) => {
                          if (i !== currentPlayer) {
                            return player;
                          }

                          return {
                            ...player,
                            sets: [...player.sets, counter],
                            score: player.score + currentCounter * 2,
                          };
                        })
                      );
                    } else {
                      setPlayers(
                        players.map((player, i) => {
                          if (i !== currentPlayer) {
                            return player;
                          }

                          return {
                            ...player,
                            sets: [...player.sets, counter],
                          };
                        })
                      );
                    }

                    switchTurns();
                  }}
                >
                  Ok
                </button>
              </div>
            )}
          </div>
        </div>
      </PageModule>
    );
  }

  if (gameStarted) {
    return (
      <PageModule
        title="300"
        className="w-full h-screen flex flex-col items-start justify-start"
      >
        <CurrentBG />

        <div className="absolute top-0 left-0 flex h-full flex-col items-center justify-center w-full bg-black/40">
          <div className="flex w-full items-center justify-center p-2 border-b">
            <strong className="text-xl text-white">
              {players[currentPlayer].name} - {players[currentPlayer].score}
            </strong>
          </div>

          <div className="flex h-full flex-col items-center justify-center w-full relative">
            <strong className="text-6xl text-white">{counter}</strong>

            {!setFinished ? (
              <div className="flex gap-2 mt-4">
                <button
                  className="w-20 h-20 rounded-md bg-red-500 text-4xl opacity-90 text-white"
                  onClick={() => setCounter(counter - 1)}
                >
                  -
                </button>
                <button
                  className="w-20 h-20 rounded-md bg-red-500 text-4xl opacity-90 text-white"
                  onClick={() => setCounter(counter + 1)}
                >
                  +
                </button>
              </div>
            ) : (
              <div className="flex flex-col mt-8 items-center justify-center">
                <strong className="text-4xl text-white">Gamble?</strong>

                <div className="flex gap-2 mt-4">
                  <button
                    className="w-24 h-16 rounded-md bg-red-500 text-4xl opacity-90 text-white"
                    onClick={() => {
                      let currentCounter = counter;

                      if (takingCredit) {
                        if (counter >= minCredit) {
                          const add = (counter - minCredit) * 2;

                          currentCounter += add;
                        } else {
                          const add = (counter - minCredit) * 3;

                          currentCounter += add;
                        }
                      }

                      setPlayers(
                        players.map((player, i) => {
                          if (i !== currentPlayer) {
                            return player;
                          }

                          return {
                            ...player,
                            sets: [...player.sets, counter],
                            score: player.score + currentCounter,
                          };
                        })
                      );

                      switchTurns();
                    }}
                  >
                    No
                  </button>
                  <button
                    className="w-24 h-16 rounded-md bg-green-500 text-4xl opacity-90 text-white"
                    onClick={() => setGambling(true)}
                  >
                    Yes
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center">
            <small className="text-white">{is300 ? is300 : 0} / 300</small>
          </div>

          <div className="flex w-full items-center justify-center p-2 gap-2">
            {players[currentPlayer].score > 0 && (
              <button
                className={`p-2 bg-violet-600 text-white rounded-md ${
                  takingCredit ? "" : "opacity-60"
                }`}
                onClick={() => {
                  setTakingCredit(!takingCredit);
                  setMinCredit(
                    players[currentPlayer].sets[
                      players[currentPlayer].sets.length - 1
                    ] -
                      1 >
                      6
                      ? players[currentPlayer].sets[
                          players[currentPlayer].sets.length - 1
                        ] - 1
                      : 6
                  );
                }}
                disabled={counter > 0}
              >
                Credit{" "}
                {players[currentPlayer].sets[
                  players[currentPlayer].sets.length - 1
                ] -
                  1 >
                6
                  ? players[currentPlayer].sets[
                      players[currentPlayer].sets.length - 1
                    ] - 1
                  : 6}
              </button>
            )}

            <button
              className="p-2 bg-pink-600 text-white rounded-md disabled:opacity-70"
              onClick={() => {
                setSetFinished(true);
              }}
              disabled={counter < 1}
            >
              Finish set
            </button>
          </div>
        </div>
      </PageModule>
    );
  }

  return (
    <PageModule
      title="300"
      className="w-full h-screen flex flex-col items-start justify-start"
    >
      <CurrentBG />

      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black/40">
        <div className="flex flex-col">
          <strong className="text-white">Add player</strong>

          <input
            type="text"
            name="name"
            id="name"
            className="border p-2 my-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            className="text-xl text-white bg-red-500"
            onClick={() => {
              setPlayers([...players, { name, sets: [], score: 0 }]);
              setName("");
            }}
          >
            +
          </button>
        </div>

        <ul className="flex flex-col text-white mt-4 w-full px-4 items-center justify-center gap-2">
          {players.map((p, i) => (
            <li key={i} className="text-center">
              {p.name}
            </li>
          ))}
        </ul>

        <button
          className="mt-20 bg-red-500 text-white p-2 rounded-md"
          onClick={() => setGameStarted(true)}
          disabled={players.length === 0}
        >
          Start game of stienis
        </button>
      </div>
    </PageModule>
  );
}
