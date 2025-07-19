import { X, Bell, BellOff } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, authUser, muteConversation, unmuteConversation } = useAuthStore();
  const isMuted = (authUser?.mutedConversations || []).some(id => String(id) === String(selectedUser._id));

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Mute/Unmute button */}
        <div className="flex items-center gap-2 relative">
          <button
            className="btn btn-sm btn-ghost relative"
            title={isMuted ? "Unmute Conversation" : "Mute Conversation"}
            onClick={() => {
              if (isMuted) {
                unmuteConversation(selectedUser._id);
              } else {
                muteConversation(selectedUser._id);
              }
            }}
          >
            {isMuted ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
            {isMuted && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold border border-white">
                ×
              </span>
            )}
          </button>
          {/* Close button */}
          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
