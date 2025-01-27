
import { Chess, Color, PieceSymbol, Square } from 'chess.js'

import { useState } from 'react'
import { useEffect } from 'react'
import { FaChessKing, FaChessQueen, FaChessRook, FaChessBishop, FaChessKnight, FaChessPawn } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const chessIcons = {
  'k': FaChessKing,     // King
  'q': FaChessQueen,    // Queen
  'r': FaChessRook,     // Rook
  'b': FaChessBishop,   // Bishop
  'n': FaChessKnight,   // Knight
  'p': FaChessPawn      // Pawn
};

const ChessPieceIcon = ({ piece }) => {
    const IconComponent = chessIcons[piece]; // Retrieve icon based on abbreviation
    return IconComponent ? <IconComponent size="3rem"/ > : null; // Render icon if exists
  };
interface board {
        square: Square;
        type: PieceSymbol;
        color: Color;
    } 

    interface move{
        from:string,
        to:string
    }

const Board = ({socket,message,Side}:{Side:'WHITE'|'BLACK',socket:WebSocket,message:any}) => {



    
    
    const [move, setmove] = useState<move|null>(null)
    const [select, setselect] = useState<string|null>(null)
    const [Board, setBoard] = useState<(board|null)[][]|[]>([])
    const [chess, setchess] = useState<Chess|null>(null)
    const [click, setclick] = useState(1)
    const [Socket, setSocket] = useState<WebSocket>(socket)
    const [side, setside] = useState(Side)
   const [turn, setturn] = useState<number>(1)


    useEffect(() => {
        const ches=new Chess();
    
    setchess(ches)
    setBoard(ches.board())
console.log(ches.board())
    }, [])

    useEffect(() => {
      
if(message.type==='MOVE'){
    try{

        chess?.move(message.move)
        setturn(turn+1)
        setBoard(chess?.board())
    }catch(e){

    }
}

    }, [message])
    

        useEffect(() => {


            if(turn%2===0&&Side==='WHITE'){
                console.log('tere bar i nai hai')
                return
            }
            if(turn===1&&Side==='BLACK'){
                console.log('tere bar i nai hai')
                return
                                    }

            console.log(select)
            if(move===null){
                if(select){

                    setmove({from:select,to:''});
                }
               
            }
           
            
            else{
                const newmove=move
                newmove.to=select;
                
                try{
                    
                    const mm=chess?.move(newmove)
                    
                    console.log(JSON.stringify({type:'MOVE',move:newmove}))
                    const audio = new Audio('https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-check.mp3');
                    audio.play().then(r=>console.log(r)).catch(e=>console.log(e))          
                    setBoard(chess.board())
                    setselect(null)
                    if (socket.readyState === WebSocket.OPEN) {
                        socket.send(JSON.stringify({type:'MOVE',move:newmove}))
                        
                    } else {
                        console.log("WebSocket is not open. Cannot send move.");
                    }
                    setmove(newmove);    
                    setturn(turn+1)
                    
                }catch(e){
                    setselect(null)
                    toast.error('Wrong Move')   
                    console.log(e,'wromg move')
                    
                }

                
                
                console.log(newmove)
            }
        
            
        }, [click])

      
        
    
    
  return (
    <div>
        {Side.length>0&&<div className='text-white  text-xl'> { Side==='BLACK'?'YOU':'Opponent'}</div>}
<div>

{Board.map((item,i)=>{
    i++;

    return(
        <div className='flex'>{item.map((item2,j)=>{ j++;return( <div onClick={()=>{
            setclick(click+1)
            console.log(turn);
            console.log(side)
            console.log(Side)
            
            
            if(turn%2===0&&Side==='WHITE'){
    return
                   }
                   if(turn%2===1&&Side==='BLACK'){
    return
                   }
            console.log(turn);console.log(Side) ;  if(move?.from&&move.to){
                setmove(null)
        }  
        
        setselect( String.fromCharCode(96+j)+ (9-i)) }} className={`size-[75px] ${select===item2?.square&&'border-black border-2'}  cursor-pointer flex items-center justify-center ${((j+i)%2===0)?'bg-green-300':'bg-green-600'} ${item2?.color==='b'?'text-black':'text-white'} border `}>  <ChessPieceIcon piece={item2?.type}></ChessPieceIcon> </div>);})}</div>
    );
})}

</div>
{Side.length>0&&<div className='text-white  text-xl'> { Side==='WHITE'?'YOU':'Opponent'}</div>}
    </div>
  )
}

export default Board