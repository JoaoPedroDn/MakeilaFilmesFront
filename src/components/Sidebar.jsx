import React from "react";

function Sidebar({ selectedCategory, onCategoryChange}) {
    
     const handleNavigationClick = (categoryName, e) => {
        onCategoryChange(categoryName);
        
        if (e && e.currentTarget) {
            e.currentTarget.blur();
        }
    };


    const renderNavItem = (categoryName) => {
        return(
        <li 
        key={categoryName} 
        className={`nav-item ${selectedCategory === categoryName ? `active` : `` }`}
        >
            <button
            className="nav-link"
            onClick={(e) => handleNavigationClick(categoryName, e)}
            title={categoryName}
            >
                {categoryName}
            </button>
        </li>
        );
    };

    const contaItems = [
        `Carrinho`,
        `Meus Filmes`,
        `Favoritos`,
        `Configurações`
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-section">
                <h3 className="section-title">Explorar</h3>
                <ul className="nav-list">
                   {renderNavItem('Início')}
                    {renderNavItem('Lançamentos')}
                    {renderNavItem('Em Alta')}
                    {renderNavItem('Gêneros')}
                </ul>
            </div>

            <hr className="sidebar-divider"/>

            <div className="sidebar-section">
                <h3 className="section-title">Conta</h3>
                <ul className="nav-list">
                    {contaItems.map(item => renderNavItem(item))}
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;