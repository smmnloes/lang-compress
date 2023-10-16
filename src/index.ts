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
    if (root.terminal) {
        console.log(root.value)
    }
    if (!(Object.values(root.links).length === 0)) {
        for (const value of Object.values(root.links)) {
            printAllWords(value)
        }
    }
}

function initTrie() {
    const root: TrieNode = {links: {}, terminal: false}

    const words: string[] = fs.readFileSync(path.resolve(__dirname, '..', 'resources', 'words_english.txt')).toString().split('\n')
    for (const word of words) {
        addWord(root, word)
    }
    printAllWords(root)
    console.log('done')
}

initTrie()