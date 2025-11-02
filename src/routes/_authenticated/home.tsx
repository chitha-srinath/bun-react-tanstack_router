import { createFileRoute } from "@tanstack/react-router";
import { useCounterStore } from "@/stores/counter.store.ts";

export const Route = createFileRoute("/_authenticated/home")({
  component: RouteComponent,
});

function RouteComponent() {
  const count = useCounterStore((state) => state.count);
  const incrementCounter = useCounterStore((state) => state.increment);
  const decrementCounter = useCounterStore((state) => state.decrement);
  const resetCounter = useCounterStore((state) => state.reset);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Counter App</h1>
        <div className="text-5xl font-bold text-center mb-8">{count}</div>
        <div className="flex gap-4 justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => incrementCounter()}
          >
            Increment
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => decrementCounter()}
          >
            Decrement
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => resetCounter()}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
