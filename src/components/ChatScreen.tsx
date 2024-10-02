import axios from "axios";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
	id: string;
	message: string;
	sender: {
		image: string;
		is_kyc_verified: boolean;
		self: boolean;
		user_id: string;
	};
	time: string;
}

interface ChatArray {
	chats: ChatMessage[];
	from: string;
	message: string;
	name: string;
	status: string;
	to: string;
}

export const ChatScreen = () => {
	const [chatData, setChatData] = useState<ChatArray | null>(null);
	const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(false);
	const chatContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await axios.get(
					`https://qa.corider.in/assignment/chat?page=${page}`
				);
				console.log("Fetched data for page:", page, response.data);

				setChatData((prev) => ({
					...response.data,
					chats: prev
						? [...response.data.chats, ...prev.chats]
						: response.data.chats,
				}));

				// console.log(page)

				setLoading(false);
			} catch (error) {
				console.error(error);
				setLoading(false);
			}
		};

		if (page >= 0) {
			// Adjusted to fetch for page 0 on initial load
			fetchData();
		}
	}, [page]);

	const handleScroll = () => {
		if (chatContainerRef.current) {
			const { scrollTop } = chatContainerRef.current;

			// console.log(chatContainerRef.current.scrollTop)
			if (scrollTop === 0 && !loading) {
				setPage((prevPage) => prevPage + 1);
			}
		}
	};

	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.addEventListener("scroll", handleScroll);
			// console.log("test");
		}

		return () => {
			if (chatContainerRef.current) {
				chatContainerRef.current.removeEventListener("scroll", handleScroll);
			}
		};
	}, [loading]);

	if (!chatData) {
		// setLoading(true);
		return <>Loading....</>;
	}

	return (
		<div className="h-screen flex flex-col bg-gray-100">
			{/* Header */}
			<header className="bg-white shadow flex justify-between items-center p-4">
				<div className="flex items-center">
					<img
						src="./back_arrow.png"
						alt=""
						className="ml-4 h-[1.7rem] flex items-center"
					/>
					<div className="ml-4">
						<p className="text-lg text-gray-500 font-semibold">{`From ${chatData.from}`}</p>
						<p className="text-lg font-semibold">{`To ${chatData.to}`}</p>
					</div>
				</div>
				<div className="relative">
					<img src="./three_dots.png" alt="" className="h-[1rem]" />
				</div>
			</header>

			{/* Chat messages */}
			<div
				ref={chatContainerRef}
				className="flex-1 overflow-y-auto p-4 space-y-2"
			>
				{chatData.chats.map((chat) => (
					<div
						key={chat.id}
						className={`flex ${
							chat.sender.self ? "justify-end" : "justify-start"
						}`}
					>
						{!chat.sender.self && (
							<div className="mr-4 self-center">
								<img
									className="w-10 h-10 rounded-full"
									src={chat.sender.image}
									alt="Sender Avatar"
								/>
							</div>
						)}
						<div
							className={`${
								chat.sender.self
									? "bg-blue-500 text-white"
									: "bg-gray-300 text-black"
							} p-2 rounded-lg max-w-xs`}
						>
							<p>{chat.message}</p>
							<div className="text-xs text-gray-400 mt-1">
								{new Date(chat.time).toLocaleString()}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Input Footer */}
			<footer className="bg-white p-4 shadow">
				<div className="flex items-center space-x-2">
					<button className="text-xl">📷</button>
					<input
						className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
						type="text"
						placeholder="Reply to @Rohit Yadav"
					/>
					<button className="text-xl">📩</button>
				</div>
			</footer>
		</div>
	);
};
