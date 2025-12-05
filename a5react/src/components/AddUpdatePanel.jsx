
export function AddUpdatePanel({
  selectedItem,
  panelItem,
  inputChangeHandler,
  doneClickHandler,
  resetClickHandler,
  cancelClickHandler,
}) {


    return (
        <form>
            
            <div className='mb-2'>
                <label>ID</label>
                <input type='number' value={panelItem?.id || ""} name='id' min='100' max='999' onChange={(e) => inputChangeHandler('id', e.target.value)}></input>
            </div>
            <div className='mb-2'>
                <label>Category</label>
                <input type='text' value={panelItem?.category || ""} name='category' maxLength={3} onChange={(e) => inputChangeHandler('category', e.target.value.toUpperCase())}></input>
            </div>
             <div className='mb-2'>
                <label>Description</label>
                <input type='text' value={panelItem?.description || ""} name='description' onChange={(e) => inputChangeHandler('description', e.target.value)}></input>
            </div>
             <div className='mb-2'>
                <label>Price</label>
                <input type='number' value={panelItem?.price || ""} name='price' onChange={(e) => inputChangeHandler('price', e.target.value)}></input>
            </div>
             <div className='mb-2'>
                <label>Vegetarian</label>
                <input type='checkbox' checked={panelItem?.vegetarian || false} name='vegetarian' onChange={(e) => inputChangeHandler('vegetarian', e.target.checked)}></input>
            </div>

            <div className='mt-3'>
                <button className='btn btn-primary' onClick={doneClickHandler}>Done</button>
                <button className='btn btn-secondary ms-2 me-2' onClick={resetClickHandler}>Reset</button>
                <button className='btn btn-secondary' onClick={cancelClickHandler}>Cancel</button>
            </div>
        </form>
    );
}
