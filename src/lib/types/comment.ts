export interface CommentTree {
	info: PostInfo;
	comments: CommentNode[];
}

export interface PostInfo {
	url: string;
	count: number;
	first_time: string;
	last_time: string;
}

export interface CommentNode {
	comment: Comment;
	replies?: CommentNode[];
}

export interface Comment {
	/** comment ID, read only */
	id: string;
	/** parent ID */
	pid: string;
	/** comment text, after md processing */
	text: string;
	/** original comment text */
	orig?: string;
	/** user info, read only */
	user: User;
	/** post locator */
	locator: Locator;
	/** comment score, read only */
	score: number;
	/**
	 * vote delta,
	 * if user hasn't voted delta will be 0,
	 * -1/+1 for downvote/upvote
	 */
	vote: 0 | 1 | -1;
	/** comment controversy, read only */
	controversy?: number;
	/** time stamp, read only */
	time: string;
	title?: string;
}

export interface Locator {
	/** site id */
	site: string;
	/** post url */
	url: string;
}

export interface User {
	name: string;
	id: string;
	picture: string;
	admin: boolean;
	site_id: string;
}

export type CommentSorting =
	| '-time'
	| '+time'
	| '-active'
	| '+active'
	| '-score'
	| '+score'
	| '-controversy'
	| '+controversy';
