import TaskBoard from "../components/TaskBoard";
import type { Task } from "../hooks/useTasks";

export interface HomeProps {
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  isCompact: boolean;
}

const Home = ({ onAddTask, onEditTask, isCompact }: HomeProps) => (
  <section className="h-full">
    <TaskBoard onAddTask={onAddTask} onEditTask={onEditTask} isCompact={isCompact} />
  </section>
);

export default Home;
