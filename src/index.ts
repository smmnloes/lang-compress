import fs from 'fs'
import path from 'path'

type TrieNode = {
    value?: string
    links: { [char: string]: TrieNode }
    terminal: boolean
}

function addWord(root: TrieNode, word: string) {
    let currentNode = root
    for (let i = 0; i < word.length; i++) {
        const char = word.charAt(i)
        const link = currentNode.links[char];
        if (link !== undefined) {
            currentNode = link
        } else {
            const isLastChar = i == word.length - 1
            const newNode: TrieNode = {value: isLastChar ? word : undefined, terminal: isLastChar, links: {}};
            currentNode.links[char] = newNode
            currentNode = newNode
        }
    }
}

function printAllWords(root: TrieNode) {
    if (Object.values(root.links).length === 1) {
        console.log('Found')
    }
    if (root.terminal) {
        console.log(root.value)
    }
    if (!(Object.values(root.links).length === 0)) {
        for (const value of Object.values(root.links)) {
            printAllWords(value)
        }
    }
}



function initTrie(): TrieNode {
    const root: TrieNode = {links: {}, terminal: false}

    const words: string[] = fs.readFileSync(path.resolve(__dirname, '..', 'resources', 'words_english.txt')).toString().split('\n')
    for (const word of words) {
        addWord(root, word)
    }
    console.log('done')
    return root
}


function compress(input: string, trie: TrieNode): string {
    const words = input.toLowerCase().split(' ')
    const wordsCompressed = words.map(word => {
        let compressedWord = ''
        let currentNode = trie
        for (let i = 0; i < word.length; i++) {
            const currentChar = word.charAt(i)
            const nextNode = currentNode.links[currentChar];
            if (!nextNode) {
                console.log(`Word ${word} is not known to trie`)
            } else {
                if (Object.values(trie.links).length === 1) {
                    // omit character because it is only one that can follow
                    currentNode = nextNode
                } else {
                    compressedWord += currentChar
                    currentNode = nextNode
                }
            }
        }
        return compressedWord
    })
    return wordsCompressed.join(' ')
}

const root = initTrie()

console.log(compress('The maximum size for files that AppCode is able to open, is controlled by the '.toLowerCase(), root))