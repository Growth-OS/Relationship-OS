import { AddTeamMemberDialog } from "./AddTeamMemberDialog";
import { TeamMembersList } from "./TeamMembersList";

export const TeamSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Team Management</h1>
        <AddTeamMemberDialog />
      </div>
      <TeamMembersList />
    </div>
  );
};