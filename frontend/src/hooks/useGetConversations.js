import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

function useGetConversations() {
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/users");
                const data = await response.json();
                if(data.error) throw new Error(data.error);
                setConversations(data);
                // toast.success("Conversations fetched successfully");
            } catch (error) {
                toast.error("Error fetching conversations", error);
            }
            finally {
                setLoading(false);
            }
        };

        getConversations();
    }, []);

    return { loading, conversations };
}

export default useGetConversations