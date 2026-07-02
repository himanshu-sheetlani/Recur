import { PieChart } from '@mui/x-charts/PieChart';
import Recent from './Recent';
import type { stats } from '../../types/stats';

const Main = ({ data }: { data: stats }) => {
  return (
    <>
    <div className="h-1/2 w-full mb-5  text-white bg-[#1e1f25] rounded-3xl flex">
          <div className="bg-[#2b2c35] rounded-xl p-3 px-10 w-2/5 m-5 my-10 flex justify-center items-center">
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
                faded: { innerRadius: 65, additionalRadius: -10 , color: 'gray' },
                highlightScope: { fade: 'global', highlight: 'item' },
                innerRadius: 75,
                outerRadius: 100,
                paddingAngle: 2,
                cornerRadius: 3,
                startAngle: -135,
                endAngle: 135,
              }
            ]
          }
          slotProps={{ 
            legend: { 
              sx: {
                color: "#ffffff"
              }
            }, 
          }}
          />
          </div>
          <div className=" w-1/5 m-5 mx-0 p-2 flex flex-col">
            <div className="flex justify-center items-center flex-col rounded-lg h-1/3 m-2 mx-0 bg-[#2b2c35]">
              <h1 className="text-3xl font-black">{data?.tag.easy}</h1>
              <p className="text-md">Easy</p>
            </div>
            <div className="flex justify-center items-center flex-col rounded-lg h-1/3 m-2 mx-0 bg-[#2b2c35]">
              <h1 className="text-3xl font-black">{data?.tag.medium}</h1>
              <p className="text-md">Medium</p>
            </div>
            <div className="flex justify-center items-center flex-col rounded-lg h-1/3 m-2 mx-0 bg-[#2b2c35]">
              <h1 className="text-3xl font-black">{data?.tag.hard}</h1>
              <p className="text-md">Hard</p>
            </div>
          </div>
          <div className="w-2/5 m-5 ml-0 p-2 flex flex-col justify-between">
            <div className="flex justify-around items-center h-1/2 m-2 rounded-lg bg-[#2b2c35]">
              <p className="text-md m-10">Total Questions</p>
              <h1 className="text-3xl m-10 font-bold">{data.totalQuestion}</h1>
            </div>
            <div className="flex justify-around items-center h-1/2 m-2 rounded-lg bg-[#2b2c35]">
              <p className="text-md m-10">Average time</p>
              <h1 className="text-3xl m-10 font-bold">{Math.floor(data.avgTime / 60)}m {Math.floor(data.avgTime % 60)}s</h1>
            </div>
          </div>
        </div>
        
        <Recent data={data}/>
    </>
  )
}

export default Main