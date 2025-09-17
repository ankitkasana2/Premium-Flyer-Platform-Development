import React from 'react'

const FilterBar = () => {
    return (
        <div className='col-span-2  p-2'>
            <div className='flex flex-col gap-4 justify-between h-full'>
                {/* category  */}
                <div className='flex flex-col gap-1'>
                    <h2>Category</h2>
                    <div className='p-2  rounded-md bg-gray-700/15 backdrop-blur-md shadow-[0_0_25px_rgba(0,0,0,0.8)]'>
                    </div>
                </div>

                {/* price range  */}
                <div>
                    <h2>Price</h2>
                </div>

                {/* type  */}
                <div>
                    <h2>Tempalte Type</h2>
                </div>
            </div>
        </div>
    )
}

export default FilterBar