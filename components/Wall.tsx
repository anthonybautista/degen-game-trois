import {
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from "wagmi";
import {gameAbi} from "../consts/abi";
import {useState} from "react";
import blockOptions from '../consts/numberMapping.json';
import {parseEther} from "viem";
import * as React from "react";
import EmptyBox from "./EmptyBox";
const avaxDomainSdk = require("@catalystdigital/avax-domain-sdk");
import green from 'static/green.png';
import red from 'static/red.png';

const Wall: (props) => JSX.Element = (props) => {

  const { game, remaining, board, chain, selectedBlock, toast, address, refetchState } = props;

  const [selectedBox, setSelectedBox] = useState(100);

  const setBox = (box) => {
      setSelectedBox(box);
  }

  // const {refetch: refetchBoard} = useContractRead({
  //   address: game,
  //   abi: gameAbi,
  //   functionName: 'getBoard',
  //   args: [board],
  //   chainId: chain,
  //   onSuccess(data: Number[]) {
  //     setBoxes(data)
  //   },
  // })

  useContractEvent({
    address: game,
    abi: gameAbi,
    eventName: 'SpaceChosen',
    chainId: chain,
    listener(log) {
      console.log(log);
      refetchState();
    },
  })

  useContractEvent({
    address: game,
    abi: gameAbi,
    eventName: 'SpacePopped',
    chainId: chain,
    listener(log) {
      console.log(log);
      refetchState();
    },
  })

  const { config } = usePrepareContractWrite({
    address: game,
    abi: gameAbi,
    functionName: 'pickSpace',
    args: [BigInt(selectedBox)],
    value: parseEther("0.5"),
  })
  const { data, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      toast.success("Successfully selected space!");
      refetchState();
    },
    onError(error) {
      toast.error(error);
    }
  })

  const getRows = (arr) => {
    return [arr.slice(0,3), arr.slice(3,6), arr.slice(6,9)]
  }

  const getColor = (add) => {
    if (add === address) {
      return 'static/green.png';
    }
    return 'static/red.png'
  }

  const checkRemaining = (space) => {
    if (!remaining.includes(space)) {
      return 0.3;
    }
    return 1.0;
  }

  return (
    <div id="wall">
      <table>
        <tbody>
          {
              getRows(board).map((row, i) => (
                <tr key={i}>
                  {
                    row.map((box, index) => (
                      <td key={index + (i * 3)}>
                        {
                          board[index + (i * 3)] === '0x0000000000000000000000000000000000000000' ?
                            <EmptyBox setBox={setBox} id={index + (i * 3)} write={write} owner={board[index + (i * 3)]}/>
                            // <img
                            //   width={100}
                            //   height={100}
                            //   src={getColor(board[index + (i * 3)])}
                            //   alt={`Block ${index + (i * 3)}`}
                            // />
                          :
                            <img
                              width={100}
                              height={100}
                              src={getColor(board[index + (i * 3)])}
                              alt={`Block ${index + (i * 3)}`}
                              style={{"opacity": `${checkRemaining(index + (i * 3))}`}}
                            />
                        }
                      </td>
                    ))
                  }
                </tr>
              ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default Wall;