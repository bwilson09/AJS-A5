function ButtonPanel({ addClickHandler, updateClickHandler, deleteClickHandler, selectedItem}){
    return(
        <div className="d-flex btn-group">
            <button
             className='btn btn-success'
             onClick={addClickHandler}>
                Add Menu Item
             </button>
             <button 
             className='btn btn-secondary'
             onClick={updateClickHandler}
             disabled ={selectedItem ? false: true}>
                Update Menu Item
             </button>
             <button
             className='btn btn-danger'
             onClick={deleteClickHandler}
             disabled ={selectedItem ? false: true}>
                Delete Menu Item
             </button>

        </div>
    )
}

export { ButtonPanel };