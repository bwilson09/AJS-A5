
export function MenuTable({ menuItems, tableClickHandler, selectedItem}){
    return (
        <table className='table table-striped table-hover'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Vegetarian</th>
                </tr>
            </thead>
            <tbody>
                
                    {menuItems.map((item) => {
                        return (
                            <tr
                                key={item.id}
                                onClick={() => tableClickHandler(item)}
                                className={selectedItem && selectedItem.id === item.id ? "table-primary": ""}>
                                <td>{item.id}</td>
                                <td>{item.category}</td>
                                <td>{item.description}</td>
                                <td>{item.price}</td>
                                <td>{item.vegetarian ? "Yes" : "No"}</td>
                            </tr>

                        );
                    })}
                
                
            </tbody>
        </table>
    )
}