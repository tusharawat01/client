"use client"
import {useState} from 'react';

export default function GroupWithTagsOption({
	group,k
}) {

	return (
		<optgroup label={group?.name} key={k}>
			{
				group?.tags?.map((tag,l)=>(
					<option key={l} value={tag}>{tag}</option>
				))
			}
		</optgroup> 
	)
}