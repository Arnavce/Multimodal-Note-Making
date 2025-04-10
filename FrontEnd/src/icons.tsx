
export function IconButton({
  icon, onClick, activated
}: {
  icon: React.ReactNode;
  onClick: () => void;
  activated: boolean;
}) {
  
  return (

    <div
    className={`pointer rounded-full border-2 p-3 bg-black hover:bg-gray ${activated ? "text-red-700" : "text-white"}` }  

      onClick={onClick}>

      {icon} 

    </div>

  );
  
}
