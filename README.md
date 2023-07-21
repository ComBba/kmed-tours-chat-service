<h2>Chat with AI</h2><p>이 웹 앱은 사용자와 대화하는 AI 챗봇을 구현한 것입니다. OpenAI의 GPT-4를 활용하여 사용자의 질문에 대한 답변을 생성합니다.</p><h3>기술 스택</h3><ul><li>React.js (프론트엔드)</li><li>Next.js (백엔드와 서버사이드 렌더링)</li><li>Tailwind CSS (스타일링)</li><li>Vercel (배포)</li><li>OpenAI GPT-4 (AI 모델)</li></ul><h3>설치 및 실행 방법</h3><h4>Prerequisites</h4><ul><li>Node.js 14.x 이상</li><li>npm 6.x 이상</li></ul><h4>Installation</h4><pre><div class="bg-black rounded-md mb-4"><div class="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span>bash</span><button class="flex ml-auto gap-2"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>Copy code</button></div><div class="p-4 overflow-y-auto"><code class="!whitespace-pre hljs language-bash"><span class="hljs-comment"># 프로젝트 복제</span>
git <span class="hljs-built_in">clone</span> https://github.com/ComBba/kmed-tours-chat-service.git

<span class="hljs-comment"># 디렉토리 이동</span>
<span class="hljs-built_in">cd</span> kmed-tours-chat-service

<span class="hljs-comment"># 의존성 설치</span>
npm install

<span class="hljs-comment"># 로컬에서 실행</span>
npm run dev
</code></div></div></pre><p>이제 <code>http://localhost:3000</code>에서 앱을 볼 수 있습니다.</p><h3>배포 방법</h3><p>이 프로젝트는 Vercel을 사용하여 배포할 수 있습니다.</p><pre><div class="bg-black rounded-md mb-4"><div class="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span>bash</span><button class="flex ml-auto gap-2"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>Copy code</button></div><div class="p-4 overflow-y-auto"><code class="!whitespace-pre hljs language-bash"><span class="hljs-comment"># Vercel CLI 설치</span>
npm i -g vercel

<span class="hljs-comment"># 배포</span>
vercel
</code></div></div></pre><h3>특징</h3><ul><li>사용자와의 대화는 세션별로 관리되며, 각 세션에서 AI는 이전의 대화를 기억합니다.</li><li>사용자가 메시지를 전송한 후 AI의 응답이 올 때까지 "..."가 표시됩니다.</li><li>사용자가 처음 앱에 접속하면, AI는 사용자의 이름, 나이, 국가에 대해 물어봅니다. 이후로는 사용자의 메시지에 대한 응답을 생성합니다.</li></ul>