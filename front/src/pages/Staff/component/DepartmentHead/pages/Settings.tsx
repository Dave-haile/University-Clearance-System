import { MainLayout } from "../../layout/MainLayout";

const Settings = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p className="text-gray-600">
          This is the settings page for the Department Head.
        </p>
      </div>
    </MainLayout>
  );
};

export default Settings;
