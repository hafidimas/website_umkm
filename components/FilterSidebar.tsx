'use client';

import React from 'react';
import { FilterState } from '../types';
import { useShop } from '../context/ShopContext';

interface FilterSidebarProps {
    filterState: FilterState;
    setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
    onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
    filterState,
    setFilterState,
    onReset,
}) => {
    const { formatPrice, t } = useShop();

    const handleCategoryClick = (cat: string) => {
        setFilterState(prev => ({ ...prev, category: cat }));
    };

    return (
        <aside className="shop-sidebar">
            <div className="sidebar-box">
                <div className="sidebar-header">
                    <h3><i className="fa-solid fa-sliders"></i> {t('filter_title')}</h3>
                    <button type="button" className="btn-reset-filter" onClick={onReset}>Reset</button>
                </div>

                {/* Category Filter */}
                <div className="filter-group">
                    <h4>{t('filter_cat')}</h4>
                    <ul className="filter-category-list">
                        <li>
                            <button
                                type="button"
                                className={`cat-filter-btn ${filterState.category === 'all' ? 'active' : ''}`}
                                onClick={() => handleCategoryClick('all')}
                            >
                                <span>{t('all_categories')}</span>
                                <span className="cat-count">12</span>
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className={`cat-filter-btn ${filterState.category === 'leafy' ? 'active' : ''}`}
                                onClick={() => handleCategoryClick('leafy')}
                            >
                                <span>{t('leafy')}</span>
                                <span className="cat-count">6</span>
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className={`cat-filter-btn ${filterState.category === 'fruits' ? 'active' : ''}`}
                                onClick={() => handleCategoryClick('fruits')}
                            >
                                <span>{t('fruits')}</span>
                                <span className="cat-count">2</span>
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className={`cat-filter-btn ${filterState.category === 'herbs' ? 'active' : ''}`}
                                onClick={() => handleCategoryClick('herbs')}
                            >
                                <span>{t('herbs')}</span>
                                <span className="cat-count">1</span>
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className={`cat-filter-btn ${filterState.category === 'mushrooms' ? 'active' : ''}`}
                                onClick={() => handleCategoryClick('mushrooms')}
                            >
                                <span>{t('dropdown_mushrooms')}</span>
                                <span className="cat-count">2</span>
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className={`cat-filter-btn ${filterState.category === 'kits' ? 'active' : ''}`}
                                onClick={() => handleCategoryClick('kits')}
                            >
                                <span>{t('kits')}</span>
                                <span className="cat-count">1</span>
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Stock Availability */}
                <div className="filter-group">
                    <h4>{t('filter_stock')}</h4>
                    <label className="filter-checkbox">
                        <input
                            type="checkbox"
                            checked={filterState.readyStockOnly}
                            onChange={(e) => setFilterState(prev => ({ ...prev, readyStockOnly: e.target.checked }))}
                        />
                        <span>{t('filter_ready')}</span>
                    </label>
                    <label className="filter-checkbox">
                        <input
                            type="checkbox"
                            checked={filterState.organicOnly}
                            onChange={(e) => setFilterState(prev => ({ ...prev, organicOnly: e.target.checked }))}
                        />
                        <span>{t('filter_organic')}</span>
                    </label>
                </div>

                {/* Price Range Slider */}
                <div className="filter-group">
                    <h4>{t('filter_price')}</h4>
                    <div className="price-range-wrap">
                        <input
                            type="range"
                            min={10000}
                            max={200000}
                            step={5000}
                            value={filterState.maxPrice}
                            onChange={(e) => setFilterState(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
                        />
                        <div className="price-range-labels">
                            <span>{formatPrice(10000)}</span>
                            <span>Max: {formatPrice(filterState.maxPrice)}</span>
                        </div>
                    </div>
                </div>

                {/* Customer Rating Filter */}
                <div className="filter-group">
                    <h4>{t('filter_rating')}</h4>
                    <label className="filter-radio">
                        <input
                            type="radio"
                            name="ratingFilterRadio"
                            value="all"
                            checked={filterState.rating === 'all'}
                            onChange={() => setFilterState(prev => ({ ...prev, rating: 'all' }))}
                        />
                        <span>Rating 3.0 - 5.0</span>
                    </label>
                    <label className="filter-radio">
                        <input
                            type="radio"
                            name="ratingFilterRadio"
                            value="4.5"
                            checked={filterState.rating === '4.5'}
                            onChange={() => setFilterState(prev => ({ ...prev, rating: '4.5' }))}
                        />
                        <span>Rating 4.5 - 5.0</span>
                    </label>
                    <label className="filter-radio">
                        <input
                            type="radio"
                            name="ratingFilterRadio"
                            value="4.0"
                            checked={filterState.rating === '4.0'}
                            onChange={() => setFilterState(prev => ({ ...prev, rating: '4.0' }))}
                        />
                        <span>Rating 4.0 - 4.4</span>
                    </label>
                    <label className="filter-radio">
                        <input
                            type="radio"
                            name="ratingFilterRadio"
                            value="3.0"
                            checked={filterState.rating === '3.0'}
                            onChange={() => setFilterState(prev => ({ ...prev, rating: '3.0' }))}
                        />
                        <span>Rating 3.0 - 3.9</span>
                    </label>
                </div>
            </div>
        </aside>
    );
};
