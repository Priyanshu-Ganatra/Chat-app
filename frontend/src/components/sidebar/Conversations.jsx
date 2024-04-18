import useGetConversations from "../../hooks/useGetConversations";
import Conversation from "./Conversation";
import { getRandomEmoji } from "../../utils/emojis";

const Conversations = () => {
	const { loading, conversations } = useGetConversations();
	// console.log(conversations);

	return (
		<div className='py-2 flex flex-col overflow-auto'>
			{conversations.map((conversation, idx) => (
				<Conversation key={conversation._id} conversation={conversation} emoji={getRandomEmoji()} lastIndex={idx == conversations.length - 1} />
			))}
			{/* lastIndex prop because we dont want to show the divider in the sidebar after the last Conversation */}

			{loading ? <span className="loading loading-spinner"></span> : null}
		</div>
	);
};
export default Conversations;