import { PieChart } from '@mui/x-charts/PieChart';
import Recent from './Recent';
import type { stats } from '../../types/stats';

const Main = ({ data }: { data: stats }) => {
  return (
    <>
      <div className="w-full mb-5 text-white bg-[#1e1f25] rounded-3xl flex flex-col lg:flex-row p-4 md:p-6 gap-4">
        <div className="bg-[#2b2c35] rounded-xl p-4 w-full lg:w-2/5 flex justify-center items-center min-h-[220px]">
          <PieChart
            className='text-white'
            colors={['#a3e961', '#eebc51', '#ff6161']}
            series={[
              {
                data: [
                  { id: 0, value: data.tag.easy, label: 'Easy' },
                  { id: 1, value: data.tag.medium, label: 'Medium' },
                  { id: 2, value: data.tag.hard, label: 'Hard' },
                ],
                faded: { innerRadius: 50, additionalRadius: -10, color: 'gray' },
                highlightScope: { fade: 'global', highlight: 'item' },
                innerRadius: 60,
                outerRadius: 80,
                paddingAngle: 2,
                cornerRadius: 3,
                startAngle: -135,
                endAngle: 135,
              }
            ]}
            height={180}
            slotProps={{ 
              legend: { 
                sx: {
                  color: "#ffffff"
                }
              }, 
            }}
          />
        </div>
        
        <div className="w-full sm:w-auto lg:w-1/5 flex flex-row lg:flex-col gap-3">
          <div className="flex-1 flex justify-center items-center flex-col rounded-xl p-3 bg-[#2b2c35]">
            <h1 className="text-2xl md:text-3xl font-black text-[#a3e961]">{data?.tag.easy}</h1>
            <p className="text-xs md:text-sm text-gray-300">Easy</p>
          </div>
          <div className="flex-1 flex justify-center items-center flex-col rounded-xl p-3 bg-[#2b2c35]">
            <h1 className="text-2xl md:text-3xl font-black text-[#eebc51]">{data?.tag.medium}</h1>
            <p className="text-xs md:text-sm text-gray-300">Medium</p>
          </div>
          <div className="flex-1 flex justify-center items-center flex-col rounded-xl p-3 bg-[#2b2c35]">
            <h1 className="text-2xl md:text-3xl font-black text-[#ff6161]">{data?.tag.hard}</h1>
            <p className="text-xs md:text-sm text-gray-300">Hard</p>
          </div>
        </div>

        <div className="w-full lg:w-2/5 flex flex-col gap-3 justify-between">
          <div className="flex justify-between items-center px-6 py-4 rounded-xl bg-[#2b2c35] flex-1">
            <p className="text-sm md:text-md text-gray-300">Total Questions</p>
            <h1 className="text-2xl md:text-3xl font-bold">{data.totalQuestion}</h1>
          </div>
          <div className="flex justify-between items-center px-6 py-4 rounded-xl bg-[#2b2c35] flex-1">
            <p className="text-sm md:text-md text-gray-300">Average time</p>
            <h1 className="text-2xl md:text-3xl font-bold">{Math.floor(data.avgTime / 60)}m {Math.floor(data.avgTime % 60)}s</h1>
          </div>
        </div>
      </div>
      
      <Recent data={data}/>
    </>
  )
}

export default Main